import { Component, OnInit } from '@angular/core';
import { ResearchProfileMultiFormService } from "../../../services/research-profile-multi-form.service";
import { ActivatedRoute, Router } from "@angular/router";
import { FuseTranslationLoaderService } from "../../../../../core/services/translation-loader.service";
import { UserListServiceService } from "../../../../settings/services/user-list-service.service";
import { locale as lngEnglish } from "../../researcher-profile-information/i18n/en";

import { locale as lngBangla } from "../../researcher-profile-information/i18n/bn";
import { downloadIcon, noteIcon, previousIcon, printIcon } from '../../../constants/button.constants';
import { StorageService } from "../../../../../core/services/storage/storage.service";
import { SeminarService } from "../../../services/seminar.service";
import { ToastrService } from "ngx-toastr";
import { JasperServiceService } from "../../../services/jasper-service.service";

@Component({
    selector: 'app-view-seminar',
    templateUrl: './view-seminar.component.html',
    styleUrls: ['./view-seminar.component.scss']
})
export class ViewSeminarComponent implements OnInit {
    previousIcon = previousIcon;
    downloadIcon = downloadIcon;
    printIcon = printIcon;
    noteIcon = noteIcon;
    loginUserInfo: any;
    id: any
    uuid: any
    seminarModelForCreate: any
    spinner: boolean = false;
    userList: any[] = [];
    name: string;
    spinner2: boolean = false;
    config: { timeOut: 5000; closeButton: true; positionClass: 'toast-top-right'; enableHtml: true; };


    timeScheduleLeadList: any[] = new Array();
    timeScheduleResearcherList: any[] = new Array();
    timeScheduleOthersList: any[] = new Array();
    data: any = {};

    constructor(private _researchProfileMultiFormService: ResearchProfileMultiFormService,
        private activateRoute: ActivatedRoute,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private userListService: UserListServiceService,
        private router: Router,
        private _toastrService: ToastrService,
        private _seminarService: SeminarService,
        private storageService: StorageService,
        private jasperService: JasperServiceService) {
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

    ngOnInit(): void {

        this.id = this.activateRoute.snapshot.paramMap.get('id')
        this.uuid = this.activateRoute.snapshot.paramMap.get('uuid')
        let userData = this.storageService.getUserData();
        this.getViewPageData(this.uuid);
    }

    getViewPageData(uuid: number) {
        this._seminarService.getSeminarById(this.id).subscribe(
            res => {

                this.seminarModelForCreate = res.obj;
                if (this.seminarModelForCreate && this.seminarModelForCreate.createSeminarTimeScheduleOptional) {
                    this.timeScheduleLeadList = this.seminarModelForCreate.createSeminarTimeScheduleOptional.filter(f => f.positionInSeminar == 'Lead');
                    this.timeScheduleResearcherList = this.seminarModelForCreate.createSeminarTimeScheduleOptional.filter(f => f.positionInSeminar == 'Researcher');
                    this.timeScheduleOthersList = this.seminarModelForCreate.createSeminarTimeScheduleOptional.filter(f => f.positionInSeminar == 'Others');
                }
                console.log('timeScheduleLeadList ====>>>>> ', this.timeScheduleLeadList);
                console.log('timeScheduleResearcherList ====>>>>> ', this.timeScheduleResearcherList);
                console.log('timeScheduleOthersList ====>>>>> ', this.timeScheduleOthersList);
            }, error => {
                this._toastrService.error('Smoothing want to wrong!', "Error!", this.config);
            }
        )

    }

    back() {
        this.router.navigate(['/seminars']).then(r => console.log(r));
    }

    download() {
        let lang = localStorage.getItem("currentLang");
        this.spinner2 = true;
        this.jasperService.generateSeminarPdf(this.id, lang,1).subscribe((response) => {
            this.spinner2 = false;
            let file = new Blob([response], { type: 'application/pdf' });
            var fileURL = URL.createObjectURL(file);
            window.open(fileURL);
        }, error => {
            this.spinner2 = false;
        });
    }

    print() {

    }

}
