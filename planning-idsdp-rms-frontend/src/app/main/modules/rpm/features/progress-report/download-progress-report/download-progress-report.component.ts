import { Component, OnInit } from '@angular/core';
import {Subscription} from "rxjs";
import {FormBuilder, FormGroup} from "@angular/forms";
import {DEFAULT_SIZE} from "../../../../../core/constants/constant";
import {FuseTranslationLoaderService} from "../../../../../core/services/translation-loader.service";
import {ApiService} from "../../../../../core/services/api/api.service";
import {ToastrService} from "ngx-toastr";
import {SnackbarHelper} from "../../../../../core/helper/snackbar.helper";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {DataComService} from "../../../../../core/services/data-com/data-com.service";
import {ActivatedRoute, Router} from "@angular/router";
import {locale as lngEnglish} from "../i18n/en";
import {locale as lngBangla} from "../i18n/bn";
import {addNewIcon, deleteIcon, editIcon, refreshIcon, 
    viewIcon, previousIcon, sendIcon, 
    downloadIcon, printIcon, sentSuccess} from '../../../constants/button.constants';
import {ConfirmDialogConstant} from "../../../../../shared/constant/confirm.dialog.constant";
import {SubmitConfirmationDialogComponent} from "../../../../../shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component";
import {SubmitProgressReportServiceService} from "../../../services/submit-progress-report-service.service";
import {JasperServiceService} from "../../../services/jasper-service.service";
import {MatSelectChange} from "@angular/material/select";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";

@Component({
  selector: 'app-download-progress-report',
  templateUrl: './download-progress-report.component.html',
  styleUrls: ['./download-progress-report.component.scss']
})
export class DownloadProgressReportComponent implements OnInit {

    /*----Button---*/
    editIcon = editIcon;
    deleteIcon = deleteIcon;
    addNewIcon = addNewIcon;
    viewIcon = viewIcon;
    refreshIcon = refreshIcon;
    previousIcon = previousIcon;
    sendIcon = sendIcon;
    downloadIcon = downloadIcon;
    printIcon = printIcon;
    sentSuccess = sentSuccess;
    datetime = new Date();

    /*----/Button---*/
    subscription: Subscription;
    spinner: boolean = false;
    frmGroup: FormGroup;
    config: { timeOut: 5000; closeButton: true; positionClass: 'toast-top-right'; enableHtml: true; };
    formTitle = 'Save'; //Edit

    data: any;
    submitData: any;
    taskLists: any;
    taskList: any;
    isShow = false;
    show = true;

    title: any;
    fiscalYear: any;
    category: any;
    percentage: any;
    uuid: any;

    constructor(
        private formBuilder: FormBuilder,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private api: ApiService,
        private toastr: ToastrService,
        private matSnackBar: SnackbarHelper,
        private dialog: MatDialog,
        private dataCom: DataComService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private _submitProgressRepost: SubmitProgressReportServiceService,
        private _route: Router,
        private _dialog: MatDialog,
        private jasperService: JasperServiceService
    ) {
        // Language translations
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
        this.activatedRoute.params.subscribe(params => {
            this.uuid = params['uuid'];
        });
    }

    ngOnInit(): void {
        this.data = this._submitProgressRepost.element;
        this.isShow = false;
        this.show = true;
        this.getDownloadData();
    }

    public getDownloadData(){
        this.title = this.data?.researcherProposalInfo?.researchTitle,
        this.fiscalYear = this.data?.fiscalResponseDto?.fiscalYear,
        this.category = this.data?.researchCategoryTypeResponseDto?.categoryName,
        this.percentage = this.data?.researchCompletedPercentage,
        this.taskLists = this.data?.taskLists
    }

    back(){
        this.router.navigate([`list-progress-report`]);
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

    print(divName) {
        this.isShow = true;
        this.show = false;
        var printContents = document.getElementById(divName).innerHTML;
        var originalContents = document.body.innerHTML;
        document.body.innerHTML = printContents;
        window.print();
        this.router.navigate([`list-progress-report`]);
        document.body.innerHTML = originalContents;
    }

    openDialogForSend() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = false;
        dialogConfig.width = ConfirmDialogConstant.WIDTH;
        dialogConfig.height = ConfirmDialogConstant.HEIGHT;
        dialogConfig.panelClass = ConfirmDialogConstant.PANEL_CLASS;
        dialogConfig.data = { message: ConfirmDialogConstant.SEND };
        const dialogRef = this.dialog.open(SubmitConfirmationDialogComponent, dialogConfig);

        dialogRef.componentInstance.closeEventEmitter.subscribe(res => {
            if (res) {
                this.send();
            }
            dialogRef.close(true);
        });
    }

    public send(){
        this.submitData = {
            "id": this.data.id,
            "uuid": this.data.uuid,
            "researcherProposalInfoId": this.data.researcherProposalInfoId,
            "fiscalYearId": this.data.fiscalYearId,
            "researchCatTypeId": this.data.researchCatTypeId,
            "researchCompletedPercentage": this.data.researchCompletedPercentage,
            "details": this.data.details,
            "isSend": true,
            "isEditable": false,
            "bucketName": this.data.bucketName,
            "fileName": this.data.fileName,
            "downloadUrl": this.data.downloadUrl,
            "mode": this.data.mode
        };

        this._submitProgressRepost.updateData(this.submitData).subscribe(
            res => {
                if (res.success) {
                    this.spinner = false;
                    this.toastr.success(this.sentSuccess);
                    this.back();
                } else {
                    this.spinner = false;
                    this.toastr.error(res.message, "", this.config);
                }
            },
        )
    }
    openDialogForComment(row) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = false;
        dialogConfig.width = ConfirmDialogConstant.WIDTH;
        dialogConfig.height = ConfirmDialogConstant.HEIGHT;
        dialogConfig.panelClass = ConfirmDialogConstant.PANEL_CLASS;
        dialogConfig.data = {message: ConfirmDialogConstant.STATUS};
        const dialogRef = this.dialog.open(SubmitConfirmationDialogComponent, dialogConfig);
        dialogRef.componentInstance.closeEventEmitter.subscribe(res => {
            if (res) {
                this.deskOfficerComment(row);
            }
            dialogRef.close(true);
        });
    }

    deskOfficerComment(row) {
        const list = [row];
        this._submitProgressRepost.update(list).subscribe(res => {
            if (res.success) {
                this.toastr.success(res.message, "", this.config);
                //this.router.navigate([`list-progress-report`]);
            } else {
                this.toastr.warning(res.message, "", this.config);
            }
        });

    }

    openDialogForStatus($event: MatSelectChange, row) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = false;
        dialogConfig.width = ConfirmDialogConstant.WIDTH;
        dialogConfig.height = ConfirmDialogConstant.HEIGHT;
        dialogConfig.panelClass = ConfirmDialogConstant.PANEL_CLASS;
        dialogConfig.data = {message: ConfirmDialogConstant.STATUS};
        const dialogRef = this.dialog.open(SubmitConfirmationDialogComponent, dialogConfig);
        dialogRef.componentInstance.closeEventEmitter.subscribe(res => {
            if (res) {
                this.receivedStatus(row);
            }
            dialogRef.close(true);
        });

    }

    receivedStatus(row) {
        const list = [row];
        this._submitProgressRepost.update(list).subscribe(res => {
            if (res.success) {
                this.toastr.success(res.message, "", this.config);
                //this.router.navigate([`list-progress-report`]);
            } else {
                this.toastr.warning(res.message, "", this.config);
            }
        });
    }

}
