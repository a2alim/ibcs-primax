import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FuseTranslationLoaderService} from "../../../../../../core/services/translation-loader.service";
import {UserListServiceService} from "../../../../../settings/services/user-list-service.service";
import {locale as lngEnglish} from "../../participant/i18n/en";
import {locale as lngBangla} from "../../participant/i18n/bn";
import {downloadIcon, noteIcon, previousIcon, printIcon} from '../../../../constants/button.constants';
import {ParticipantService} from "../../../../services/participant.service";
import {environment, reportBackend} from "../../../../../../../../environments/environment";
import {JasperServiceService} from "../../../../../rpm/services/jasper-service.service";
import moment from "moment";
import * as bl2Js from 'bl2-js-report';

@Component({
    selector: 'app-participent-view',
    templateUrl: './participent-view.component.html',
    styleUrls: ['./participent-view.component.scss']
})
export class ParticipentViewComponent implements OnInit {


    /*----Button---*/
    previousIcon = previousIcon;
    downloadIcon = downloadIcon;
    printIcon = printIcon;
    noteIcon = noteIcon;
    /*----/Button---*/

    id: any
    tabData: any
    academicBackGroundViewsList: any[]
    spinner: boolean = false;
    userList: any[] = [];
    name: string;
    spinner2:boolean=false


    data: any = {}; //must have to check the data array declear same way

    minioFileDownloadEndPointHost: string = environment.ibcs.minioFileDownloadEndPointHost;



    constructor(
        private participantService: ParticipantService,
        private activateRoute: ActivatedRoute,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private userListService: UserListServiceService,
        private router: Router,
        private jasperService:JasperServiceService
    ) {
        // Language translations
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

    ngOnInit(): void {
        this.id = this.activateRoute.snapshot.paramMap.get('id')
        this.viewProfile(this.id);
        console.log(this.id)

    }


    backResearcherprofilelist() {
        this.router.navigate(['participant-list']);
    }


    viewProfile(id: number) {
        //personalInfo.userId
        this.spinner = true;
        this.participantService.getParticipantViewById(id).subscribe(
            data => {
                console.log(data)
                this.tabData = data;
                this.spinner = false;
                // this.getUserList();
            }, error => {
                console.log(error)
            }
        )

    }


    getUserList() {
        this.userListService.getAllUser().subscribe(
            res => {
                this.userList = res ? res : [];
                this.userList.forEach(
                    element => {
                        if (element.id == this.tabData.personalInfo.userId) {
                            this.name = element.name;
                        }

                    }
                );
            }
        );
    }

    back() {
        this.router.navigate(['/researcher-profile-information']);
    }


    download($fileName = '') {
        this.data['fileName'] = $fileName;
        this.data['templateName'] = 'ti-reports/perticipentLIst_view';
        this.data['lng'] = localStorage.getItem("currentLang");




        this.data['tabData'] = JSON.stringify(this.tabData);
        this.data['acmDataList'] = JSON.stringify(this.tabData.academicBackGroundViews);

        this.data['ImageUrl'] = this.minioFileDownloadEndPointHost+this.tabData?.image?.bucketName+'/'
        +this.tabData?.image?.fileName;
        this.data['downloadUrl'] = JSON.stringify(this.minioFileDownloadEndPointHost);

        // console.log(this.chequeCollectionResponse )


        //Optional
        this.data['view'] = 0; // 0 = false or 1 = true
        this.data['print_r'] = 0; // 0 = false or 1 = true
        let actionUrl = `${reportBackend}/pdf-generate-post`;
        bl2Js(this.data, actionUrl);
    }





















    // download() {
    //     let lang = localStorage.getItem("currentLang");
    //     this.genPdf(lang);
    // }

    genPdf(lang) {
        this.spinner2=true;
        this.jasperService.generateParticipantPdf( this.id,lang).subscribe((response)=>{
            this.spinner2=false;
            let file = new Blob([response], { type: 'application/pdf' });
            var fileURL = URL.createObjectURL(file);
            window.open(fileURL);
        },error => {
            this.spinner2=false;
        })

    }

    print() {
        window.print();
    }

    downloadNid() {
        window.open(this.minioFileDownloadEndPointHost + this.tabData.nidImage.bucketName + '/'
            + this.tabData.nidImage.fileName, "_blank");

    }

    convertDate(dateOfBirth: any) {
        return moment(dateOfBirth).format('DD-MM-YYYY');
    }

}

