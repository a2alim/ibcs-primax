import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
    addNewIcon,
    downloadIcon,
    noteIcon,
    previousIcon,
    printIcon,
} from '../../../constants/button.constants';
import { ResearchProfileMultiFormService } from '../../../services/research-profile-multi-form.service';
import { FuseTranslationLoaderService } from 'app/main/core/services/translation-loader.service';
import { locale as lngEnglish } from '../i18n/en';
import { locale as lngBangla } from '../i18n/bn';
import { UserListServiceService } from 'app/main/modules/settings/services/user-list-service.service';
import { StorageService } from 'app/main/core/services/storage/storage.service';
import { TrainingInstituteProfileService } from '../../../../training-institute/services/training-institute-profile.service';
import { JasperServiceService } from '../../../services/jasper-service.service';
import { ResearchCancellationServiceService } from "../../../services/research-cancellation-service.service";
import { ResearchCancellationStatus } from '../../../enums/enum-list.enum';
import { ToastrService } from 'ngx-toastr';
import { MatSelectChange } from '@angular/material/select';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmDialogConstant } from 'app/main/shared/constant/confirm.dialog.constant';
import { SubmitConfirmationDialogComponent } from 'app/main/shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component';
import * as bl2Js from 'bl2-js-report';
import { environment, reportBackend } from 'environments/environment';
@Component({
    selector: 'app-research-cancellation-view',
    templateUrl: './research-cancellation-view.component.html',
    styleUrls: ['./research-cancellation-view.component.scss']
})
export class ResearchCancellationViewComponent implements OnInit {

    /*----Button---*/
    previousIcon = previousIcon;
    downloadIcon = downloadIcon;
    printIcon = printIcon;
    noteIcon = noteIcon;
    /*----/Button---*/
    loginUserInfo: any;
    addNewIcon = addNewIcon;
    /*----/Button---*/

    public researchStatus = ResearchCancellationStatus;
    config: { timeOut: 5000; closeButton: true; positionClass: 'toast-top-right'; enableHtml: true; };

    id: any;
    rid: any;
    user: any;

    data: any;
    spinner: boolean = true;
    userList: any[] = [];
    name: string;
    pdfData: any = {};

    constructor(
        private _researchProfileMultiFormService: ResearchProfileMultiFormService,
        private activateRoute: ActivatedRoute,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private userListService: UserListServiceService,
        private router: Router,
        private StorageService: StorageService,
        private jasperService: JasperServiceService,
        private researchAction: ResearchCancellationServiceService,
        private toastr: ToastrService,
        private dialog: MatDialog,

    ) {
        // Language translations
        this._fuseTranslationLoaderService.loadTranslations(
            lngEnglish,
            lngBangla
        );
    }

    ngOnInit(): void {
        this.loginUserInfo = this.StorageService.getUserData();
        this.id = this.activateRoute.snapshot.paramMap.get('id');
        this.user = this.StorageService.getUserData();
        if (this.researchAction.data) {
            this.spinner = false
            this.data = this.researchAction.data;
            console.log('data ===== >>>>> ', this.data);
        }
    }

    backResearcherprofilelist() {
        this.router.navigate(['/research-cancellation']);
    }

    back() {
        this.router.navigate(['/research-cancellation']);
    }

    download() {
        this.genPdf();
    }

    genPdf() {
        // this.jasperService.generatePdf(this.id).subscribe(
        //     (response) => {
        //         let file = new Blob([response], { type: 'application/pdf' });
        //         var fileURL = URL.createObjectURL(file);
        //         window.open(fileURL);
        //     },
        //     (error) => {
        //         this.toastr.error("Sorry Cant's able to being Download!");
        //     }
        // );
    }

    print(Name) {
        var printContents = document.getElementById(Name).innerHTML;
        var originalContents = document.body.innerHTML;
        document.body.innerHTML = printContents;
        window.print();
        document.body.innerHTML = originalContents;
        this.router.navigate([`research-cancellation`]);
    }


    onUpdateStatus() {
        let data = {
            uuid: this.data.uuid,
            id: this.data.id,
            researcherProposalInfoId: this.data.researcherProposalInfoId,
            formula: this.data.formula,
            actionFor: this.data.actionFor,
            newResearchStartDate: this.data.newResearchStartDate,
            newResearchEndDate: this.data.newResearchEndDate,
            newResearchDurationMonth: this.data.newResearchDurationMonth,
            newTotalGrantAmount: this.data.newTotalGrantAmount,
            subject: this.data.subject,
            details: this.data.details,
            status: this.data.status           
        }
        
        this.researchAction.update(data).subscribe(
            res => {
                if (res.success) {
                    this.toastr.success(res.message, "", this.config);
                    this.router.navigate(['/research-cancellation']);
                } else {
                    this.toastr.error(res.message, "", this.config);
                }
            },
            err => {
                this.toastr.error('Http Error Occurred!', "", this.config);
            }
        )
    }

    downloadPDF() {
        this.pdfData['fileName'] = 'take-action';
        this.pdfData['templateName'] = 'rms-reports/takeAction';
        this.pdfData['lng'] = localStorage.getItem("currentLang");
        this.pdfData['data'] = JSON.stringify(this.data);
        // this.pdfData['dataSource'] = JSON.stringify(this.dataSource);

        //Optional
        this.pdfData['view'] = 0; // 0 = false or 1 = true
        this.pdfData['print_r'] = 0; // 0 = false or 1 = true
        let actionUrl = `${reportBackend}/pdf-generate-post`;

        console.log('this.data', this.pdfData);
        //return;

        bl2Js(this.pdfData, actionUrl);
    }


    
}
