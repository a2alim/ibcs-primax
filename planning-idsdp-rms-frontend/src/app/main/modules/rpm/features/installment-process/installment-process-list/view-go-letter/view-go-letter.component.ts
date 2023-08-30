import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
    MatDialog,
    MatDialogConfig,
    MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DEFAULT_SIZE } from 'app/main/core/constants/constant';
import { SnackbarHelper } from 'app/main/core/helper/snackbar.helper';
import { ApiService } from 'app/main/core/services/api/api.service';
import { DataComService } from 'app/main/core/services/data-com/data-com.service';
import { GlobalValidationServiceService } from 'app/main/core/services/global-validation-service.service';
import { FuseTranslationLoaderService } from 'app/main/core/services/translation-loader.service';
import {
    addNewIcon,
    closeIcon,
    deleteIcon,
    downloadIcon,
    editIcon,
    previousIcon,
    printIcon,
    refreshIcon,
    sendIcon,
    viewIcon,
    updateSuccess,
    updateFailed,
} from 'app/main/modules/rpm/constants/button.constants';
import { CreateGoLetterServiceService } from 'app/main/modules/rpm/services/create-go-letter-service.service';
import { SubmitConfirmationDialogComponent } from 'app/main/shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component';
import { ConfirmDialogConstant } from 'app/main/shared/constant/confirm.dialog.constant';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs/internal/Subscription';
import { locale as lngEnglish } from './i18n/en';
import { locale as lngBangla } from './i18n/bn';
import { GoLetterModel } from 'app/main/modules/rpm/models/GoLetterModel';
import { GoLetterServiceService } from 'app/main/modules/rpm/services/go-letter-service.service';
import { reportBackend } from 'environments/environment';

@Component({
    selector: 'app-view-go-letter',
    templateUrl: './view-go-letter.component.html',
    styleUrls: ['./view-go-letter.component.scss'],
})
export class ViewGoLetterComponent implements OnInit {
    closeEventEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();

    editIcon = editIcon;
    deleteIcon = deleteIcon;
    addNewIcon = addNewIcon;
    viewIcon = viewIcon;
    refreshIcon = refreshIcon;
    previousIcon = previousIcon;
    sendIcon = sendIcon;
    closeIcon = closeIcon;
    printIcon = printIcon;
    downloadIcon = downloadIcon;
    updateSuccess = updateSuccess;
    updateFailed = updateFailed;

    datetime = new Date();

    /*----/Button---*/
    subscription: Subscription;
    spinner: boolean = false;
    spinner2: boolean = false;

    frmGroup: FormGroup;
    config: {
        timeOut: 5000;
        closeButton: true;
        positionClass: 'toast-top-right';
        enableHtml: true;
    };
    formTitle = 'Save'; //Edit

    page: number = 0;
    totalElements: number = DEFAULT_SIZE;
    pageSize: number = DEFAULT_SIZE;
    templateType: any;
    installmentProcess: any;
    dataSource: any;
    predifinedTemplateId: any;
    predifinedTemplate: any;
    // data: any;
    submitData: any;
    data: any = {};

    getInstallmentType: any;
    getTkAmount: any;
    getResearchTitle: any;
    getCategory: any;
    getFiscalYear: any;

    getSubject: any;
    getTemplateType: any;
    getPredifinedTemplate: any;
    getMailData: any;
    goUuid: any;
    goLetterModel: GoLetterModel = new GoLetterModel();
    goLetterView: GoLetterModel = new GoLetterModel();

    constructor(
        @Inject(MAT_DIALOG_DATA) data: GoLetterModel,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private toastr: ToastrService,
        private dialog: MatDialog,
        private _createGoLetterServiceService: CreateGoLetterServiceService,
        private getGoLetterID: CreateGoLetterServiceService,
        private _goLetterServiceService: GoLetterServiceService
    ) {
        this._fuseTranslationLoaderService.loadTranslations(
            lngEnglish,
            lngBangla
        );
        this.goLetterModel = data;
    }

    ngOnInit(): void {
        this.getDataForDownloadFile();
    }

    getDataForDownloadFile() {
        this._goLetterServiceService
            .findByUuid(this.goLetterModel.uuid)
            .subscribe(
                (response) => {
                    if (response.success) {
                        this.goLetterView = response.obj;
                        this.getInstallmentType =
                            response.obj.installmentProcess.installmentType.installmentType;
                        this.getTkAmount = response.obj.totalAmount;
                        this.getResearchTitle =
                            response.obj.installmentProcess.m1ResearcherProposalId.researchTitle;
                        this.getCategory =
                            response.obj.installmentProcess.researchCategoryType.categoryName;
                        this.getFiscalYear =
                            response.obj.installmentProcess.fiscalYearResponse.fiscalYear;
                        this.getSubject = response.obj.subject;
                        this.getTemplateType =
                            response.obj.templateType.templateType;
                        this.getMailData = response.obj.mailBody;
                    }
                },
                (error) => {}
            );
    }

    //print() {
    //var data = document.getElementById('downloadable-content');
    // html2canvas(data, {scale: 2}).then(canvas => {
    //     var myImage = canvas.toDataURL("image/png");
    //     var tmp = window.open("");
    //     tmp.document.body.innerHTML =
    //         "<img src=" + myImage + " alt='' style='width:100%;'>";
    //     setTimeout(() => {
    //         tmp.print();
    //         tmp.focus();
    //     }, 300);
    // });
    //}

    //   download() {
    //     var data = document.getElementById('downloadable-content');
    //     // html2canvas(data, {scale: 2}).then(canvas => {
    //     //     var imgWidth = 208;
    //     //     var imgHeight = canvas.height * imgWidth / canvas.width;

    //     //     const contentDataURL = canvas.toDataURL('image/png', 'high')

    //     //     let pdf = new jsPDF('p', 'mm', 'a4');
    //     //     var position = 0;
    //     //     pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
    //     //     pdf.save(`GO-Letter-${this.datetime.getDate()}/${this.datetime.getMonth()}/${this.datetime.getFullYear()}-${this.data.subject}.pdf`);
    //     // });
    //   }
    download($fileName = '') {
        this.data['fileName'] = $fileName;
        this.data['templateName'] = 'ti-reports/rpm_goLetter';
        this.data['lng'] = localStorage.getItem('currentLang');

        this.data['goLetterView'] = JSON.stringify(this.goLetterView);

        console.log('this.data = ', this.data);

        const form = document.createElement('form');
        form.target = '_blank';
        form.method = 'post';

        form.action = `${reportBackend}/pdf-generate-post`;
        var params = this.data;
        for (const key in params) {
            if (params.hasOwnProperty(key)) {
                const hiddenField = document.createElement('input');
                hiddenField.type = 'hidden';
                hiddenField.name = key;
                hiddenField.value = params[key];
                form.appendChild(hiddenField);
            }
        }
        document.body.appendChild(form);
        form.submit();
    }
    openDialogForSend() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = false;
        dialogConfig.width = ConfirmDialogConstant.WIDTH;
        dialogConfig.height = ConfirmDialogConstant.HEIGHT;
        dialogConfig.panelClass = ConfirmDialogConstant.PANEL_CLASS;
        dialogConfig.data = { message: ConfirmDialogConstant.SEND };
        const dialogRef = this.dialog.open(
            SubmitConfirmationDialogComponent,
            dialogConfig
        );

        dialogRef.componentInstance.closeEventEmitter.subscribe((res) => {
            if (res) {
                this.sendGoLetter();
            }
            dialogRef.close(true);
        });
    }

    sendGoLetter() {
        this.submitData = {
            // "id": this.storeElement.element.id,
            // "uuid": this.storeElement.element.uuid,
            // "goCode": this.storeElement.element.goCode,
            // "researcherProposalId": this.storeElement.element.installmentProcess.m1ResearcherProposalId.id,
            // "installmentProcessId": this.storeElement.element.installmentProcessId,
            // "installmentTypeId": this.storeElement.element.installmentTypeId,
            // "fiscalYearId": this.storeElement.element.installmentProcess.fiscalYearResponse.id,
            // "researchCatTypeId": this.storeElement.element.installmentProcess.researchCategoryType.id,
            // "totalAmount": this.storeElement.element.totalAmount,
            // "subject": this.storeElement.element.subject,
            // "mailBody": this.storeElement.element.mailBody,
            // "templateTypeId": this.storeElement.element.templateTypeId,
            // "predefinedTemplateId": this.storeElement.element.predefineTemplate.id,
            // "isSend": true,
        };

        this._createGoLetterServiceService
            .updateData(this.submitData)
            .subscribe((res) => {
                if (res.success) {
                    this.spinner = false;
                    this.toastr.success(this.updateSuccess, '', this.config);
                } else {
                    this.spinner = false;
                    this.toastr.error(res.message, '', this.config);
                }
            });
    }

    print(divName) {
        var printContents = document.getElementById(divName).innerHTML;
        var originalContents = document.body.innerHTML;
        document.body.innerHTML = printContents;
        window.print();
        window.open(`installment-process`);
        document.body.innerHTML = originalContents;
    }

    onClose(value: boolean) {
        this.dialog.closeAll();
    }
}
