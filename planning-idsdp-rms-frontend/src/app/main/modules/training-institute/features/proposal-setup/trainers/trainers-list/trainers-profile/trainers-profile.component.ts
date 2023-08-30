import {Component, OnInit} from '@angular/core';
import {
    addNewIcon,
    downloadIcon,
    editIcon,
    noteIcon,
    pdfIcon,
    previousIcon,
    printIcon
} from "../../../../../../rpm/constants/button.constants";
import {ActivatedRoute, Router} from "@angular/router";
import {FuseTranslationLoaderService} from "../../../../../../../core/services/translation-loader.service";
import {locale as lngEnglish} from "../../../../../features/proposal-setup/trainers/i18n/en";
import {locale as lngBangla} from "../../../../../features/proposal-setup/trainers/i18n/bn";
import {TrainersService} from "../../../../../../training-institute/services/trainers.service";
import {environment} from "../../../../../../../../../environments/environment";
import {JasperServiceService} from "../../../../../../rpm/services/jasper-service.service";

@Component({
    selector: 'app-trainers-profile',
    templateUrl: './trainers-profile.component.html',
    styleUrls: ['./trainers-profile.component.scss']
})
export class TrainersProfileComponent implements OnInit {


    /*----Button---*/
    previousIcon = previousIcon;
    downloadIcon = downloadIcon;
    printIcon = printIcon;
    noteIcon = noteIcon;
    editIcon = editIcon;
    addNewIcon = addNewIcon;
    pdfIcon = pdfIcon;
    /*----/Button---*/

    id: any
    tabData: any
    spinner: boolean = false;
    trainerData: any = {}
    profileUuId: String;
    fiscalYearsList: any[];
    userList: any[] = [];
    minioFileDownloadEndPointHost:string= environment.ibcs.minioFileDownloadEndPointHost;
    spinner2:boolean=false;

    resultList: { id: number, name: string }[] = [
        {id: 1, name: "First Division/Class"},
        {id: 2, name: "Second Division/Class"},
        {id: 3, name: "Third Division/Class"},
        {id: 4, name: "Grade"},
    ];

    constructor(
        private activateRoute: ActivatedRoute,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _router: Router,
        private _trainersService: TrainersService,
        private jasperService: JasperServiceService
    ) {
        // Language translations
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

    ngOnInit(): void {
        this.profileUuId = this.activateRoute.snapshot.paramMap.get('uuid');
        if (this.profileUuId) {
            this.getProfileData();
        }

    }


    backToTrainersList() {
        this._router.navigate(['/trainers']);
    }


    download() {
        let lang = localStorage.getItem("currentLang");
        this.genPdf(lang);
    }

    genPdf(lang) {
        this.spinner2=true;
        this.jasperService.generateTraninersViewlPdf(this.profileUuId,lang).subscribe((response)=>{
            this.spinner2=false;
            let file = new Blob([response], { type: 'application/pdf' });
            var fileURL = URL.createObjectURL(file);
            window.open(fileURL);
        },error => {
            this.spinner2=false;
        })

    }

    print() {
        let printContents = document.getElementById('printPage').innerHTML;
        let originalContents = document.body.innerHTML;

        // document.body.innerHTML = printContents;

        window.print();    
    }

    findResultNameById(resultId: number){
        return this.resultList.find( elm => elm.id == resultId).name;
    }
    getProfileData() {
        this.spinner = true;
        this._trainersService.getAllTrainersListBy(this.profileUuId).subscribe(
            response => {
                console.log("ok")
                this.spinner = false;
                this.trainerData = response;
                console.log('this.trainerData ==== >>>> ', this.trainerData);
                this.spinner = false;

            },
            error => {
                console.log('error ==== >>>> ', error);
                this.spinner = false;
            }
        );
    }

    editProfile() {
    }


    downloadNid() {
        window.open(this.minioFileDownloadEndPointHost+this.trainerData?.nidImage?.bucketName+'/'+this.trainerData?.nidImage?.fileName, "_blank");
    }
}

