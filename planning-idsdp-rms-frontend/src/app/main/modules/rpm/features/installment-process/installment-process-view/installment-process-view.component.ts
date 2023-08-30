import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserListServiceService } from 'app/main/modules/settings/services/user-list-service.service';
import { environment } from 'environments/environment.prod';
import { ToastrService } from 'ngx-toastr';
import { reportBackend } from '../../../../../../../environments/environment';
import { FuseTranslationLoaderService } from '../../../../../core/services/translation-loader.service';
import {
    downloadIcon,
    noteIcon,
    pdfIcon,
    previousIcon,
    printIcon,
    refreshIcon,
    saveIcon,
} from '../../../constants/button.constants';
import { InstallmentProcessService } from '../../../services/installment-process.service';
import { JasperServiceService } from '../../../services/jasper-service.service';
import { locale as lngBangla } from '../i18n/bn';
import { locale as lngEnglish } from '../i18n/en';
import * as bl2Js from 'bl2-js-report';
import { RESEARCH_CATEGORIES } from 'app/main/core/constants/researchCategories.constants';
@Component({
    selector: 'app-installment-process-view',
    templateUrl: './installment-process-view.component.html',
    styleUrls: ['./installment-process-view.component.scss'],
})
export class InstallmentProcessViewComponent implements OnInit {
    uuid: string;
    data: any;
    config: {
        timeOut: 5000;
        closeButton: true;
        positionClass: 'toast-top-right';
        enableHtml: true;
    };
    refreshIcon = refreshIcon;
    saveIcon = saveIcon;
    previousIcon = previousIcon;
    downloadIcon = downloadIcon;
    printIcon = printIcon;
    noteIcon = noteIcon;
    pdfIcon = pdfIcon;
    spinner: boolean = false;
    total: number;
    expense: number;
    receivable: number;
    spinner2: boolean = false;
    downloadUrl= environment.ibcs.minioEndPointHost;
    researchersInfo:any;
    researchCategoryName: string

    constructor(
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private toastr: ToastrService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private installmentProcess: InstallmentProcessService,
        private jasperService: JasperServiceService,
        private userService : UserListServiceService
    ) {
        // Language translations
        this._fuseTranslationLoaderService.loadTranslations(
            lngEnglish,
            lngBangla
        );
    }
    ngOnInit(): void {
        this.uuid = this.activatedRoute.snapshot.paramMap.get('uuid');
        this.getAllData();
    }
    getAllData() {
        this.spinner = true;
        this.installmentProcess.getProcesses(this.uuid).subscribe(
            (res) => {
                if (res.success) {
                    this.data = res.obj;
                    this.getSum();
                    this.spinner = false;
                    
                    /*__________Get Research's information___________*/
                    let proposalInfo = res.obj?.installmentProcesses?.m1ResearcherProposalId
                    let researcherUserId = proposalInfo?.researcherProfilePersonalInfoMaster?.userId
                    if(researcherUserId){
                        this.userService.getUserById(researcherUserId).subscribe((res) => {
                            this.researchersInfo = res
                        })
                    }    
                    /*__________/Get Research's information___________*/
                    RESEARCH_CATEGORIES.forEach((val) => {
                        if(val.id == proposalInfo.stResearchCatTypeId){
                            this.researchCategoryName = val.category_name
                        }
                    })                   

                } else {
                    this.spinner = false;
                    this.toastr.warning(res.message, '', this.config);
                }
            },
            (error) => {
                this.spinner = false;
                this.toastr.error('Http Error Happened !.', '', this.config);
            }
        );
    }
    back() {
        this.router.navigate(['/installment-process']);
    }
    download($fileName = '') {
        this.data['fileName'] = $fileName;
        //this.data['templateName'] = 'ti-reports/installmentProcessView';
        this.data['templateName'] = 'test';
        this.data['lng'] = localStorage.getItem('currentLang');
        this.data['data'] = JSON.stringify(this.data);
        this.data['insTypes'] = JSON.stringify(
            this.data.installmentProcesses.installmentTypes
        );
        this.data['total'] = this.total;
        this.data['expense'] = this.expense;
        this.data['receivable'] = this.receivable;
        this.data['researchersInfo'] = this.researchersInfo;
        this.data['researchCategoryName'] = this.researchCategoryName;
        this.data['downloadUrl'] = this.downloadUrl;

        //Optional
        this.data['view'] = 0; // 0 = false or 1 = true
        this.data['print_r'] = 0; // 0 = false or 1 = true
        let actionUrl = `${reportBackend}/pdf-generate-post`;
        bl2Js(this.data, actionUrl);

    }
    genPdf(lang) {
        this.spinner2 = true;
        this.jasperService
            .generateInstallmentProcessPdf(this.uuid, lang)
            .subscribe(
                (response) => {
                    this.spinner2 = false;
                    let file = new Blob([response], {
                        type: 'application/pdf',
                    });
                    var fileURL = URL.createObjectURL(file);
                    window.open(fileURL);
                },
                (error) => {
                    this.spinner2 = false;
                }
            );
    }
    getSum() {
        this.total = 0;
        this.expense = 0;
        this.receivable = 0;
        this.data.expenditureList.forEach((res) => {
            this.total = this.total + res.totalAmount;
            this.expense = this.expense + res.expenseAmount;
            this.receivable = this.receivable + res.receivableAmount;
        });
    }

    downloadFiles(fileInfo: any) {
        console.log('url = ', this.downloadUrl + fileInfo);
        window.open(this.downloadUrl + fileInfo, '_blank');
    }
    installmentTypeProcess(installmentTypes: any) {
        return JSON.parse(installmentTypes);
    }
}
