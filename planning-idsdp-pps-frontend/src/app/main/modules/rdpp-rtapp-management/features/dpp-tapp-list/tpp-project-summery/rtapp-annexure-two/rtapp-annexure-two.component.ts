import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {FuseTranslationLoaderService} from "../../../../../../core/services/translation-loader.service";
import {SnackbarHelper} from "../../../../../../core/helper/snackbar.helper";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {ActivatedRoute, Router} from "@angular/router";
import { locale as lngEnglish } from './i18n/en';
import { locale as lngBangla } from './i18n/bn';
import {ConfirmDialogConstant} from "../../../../../../shared/constant/confirm.dialog.constant";
import {SubmitConfirmationDialogComponent} from "../../../../../../shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component";
import {ImplementationWorkScheduleModel} from "../../../../models/rtapp-annexure-two.model";
import {ImplementationWorkScheduleService} from "../../../../services/rtapp-annexure-two.service";
import moment from 'moment';
import {TappObjectiveCostService} from "../../../../services/tapp-objective-cost.service";
import { FormBuilder } from '@angular/forms';
import { TappAnnexureIvService } from 'app/main/modules/rdpp-rtapp-management/services/tapp-annexure/tapp-annexure-iv.service';
import { ProjectSummaryService } from 'app/main/modules/project-concept-management/services/project-summary.service';
import { FileUploadService } from 'app/main/core/services/file-upload.service';
import { TappAnnexureGoodsService } from 'app/main/modules/rdpp-rtapp-management/services/tapp-annexure/tapp-annexure-goods.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-rtapp-annexure-two',
  templateUrl: './rtapp-annexure-two.component.html',
  styleUrls: ['./rtapp-annexure-two.component.scss']
})
export class RtappAnnexureTwoComponent implements OnInit {

    count: number = 0;
    file: any;
    formInformation: any = {
        id: ""
    }
    pcMasterId: number;
    completionDate: any;
    projectTitle: any;
    totalCost: any;
    commencementDate: any;
    conceptUuid: string;
    rdppMasterId: number;
    displayFileName: any;
    backendRootUrl: any;
    spinner: boolean;

    tappWorkPlanList: ImplementationWorkScheduleModel[] = [];
    tappWorkPlanObj: ImplementationWorkScheduleModel;

    displayedColumns: string[] = ['sl', 'taskDetails', 'itemList', 'startDate', 'endDate', 'status', 'action'];

    rtappId: number;
    rtappUuid: string;
    fiscalYearList: any[] = [];
    isDataEmpty : boolean = false;
    attachmentId: number;
    attachmentName: any;
    isAttachmentEnable: boolean;

    constructor(
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private tappWorkScheduleService: ImplementationWorkScheduleService,
        private sanckbar: SnackbarHelper,
        private dialog: MatDialog,
        private router: Router,
        private route: ActivatedRoute,
        private fb: FormBuilder,
        private tappAnnexureIvService: TappAnnexureIvService,
        private matSnackBar: SnackbarHelper,
        private pcService: ProjectSummaryService,
        private tappObjectiveCostService: TappObjectiveCostService,
        private fileUploadService: FileUploadService,
        private tappAnnexureGoodsService : TappAnnexureGoodsService
    ) {
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

    ngOnInit(): void {
        this.backendRootUrl = environment.ibcs.ppsDppBackendPoint;
        this.route.queryParams.subscribe(params => {
            this.conceptUuid = params['pcUuid'];
            this.rdppMasterId = params['id'];
        });
        console.log('conceptUuid : ', this.conceptUuid);
        this.getPcData();
        this.getTappProjectByPcUuid();
    }

    /*----Set file information by onchange event----*/
    selectedFile(file: FileList): any {
        this.file = file.item(0);
    }

    /*----Data will be save into database table----*/
    saveMethod(): void {
        let jsonBody = {
            projectConceptUuid: this.route.snapshot.params['id']
        };
        const formData = new FormData();
        formData.append('attachmentFile', this.file);
        formData.append('projectConceptUuid', JSON.stringify(jsonBody));
        this.spinner = true;
        this.tappAnnexureIvService.saveData('create', formData).subscribe((res) => {
            this.matSnackBar.openSuccessSnackBar();
            this.getData();
            this.spinner = false;
        });
    }

    /*----Get Records from database table----*/
    getData() {
        this.tappAnnexureIvService.getData('get-file').subscribe((res) => {
            this.formInformation = res;
            this.displayFileName = "attachment/view/" + res.attachment.fileName;
        });
    }

    /*----Go back to dashboard----*/
    goBackToHome() {
        window.history.back();
    }


    //=== start work schedule ======
    getPcData() {
        this.pcService.getByUuid(this.conceptUuid).subscribe((res) => {
            this.pcMasterId = res.id;
            this.projectTitle = res.titleEn;
            this.commencementDate = res.expCommencementDate;
            this.completionDate = res.expCompletionDate;
            this.getTotalAmount(res.id);
            this.getAnnexureIVFile();
        })
    }

    private getTotalAmount(pcId) {
        this.tappAnnexureGoodsService.getTappAnnexure5bData(pcId).subscribe((res) => {
            let grandTotal = res.filter(f => f.componentName === "Grand_Total")[0].tappAnnualPhasingCostTotal[0];
            this.totalCost = grandTotal.totalAmount;
        })
    }

    getTappProjectByPcUuid() {
        this.tappObjectiveCostService.getProjectConceptByUuid(this.rdppMasterId).subscribe(
            (response) => {
                this.projectTitle = response.res.projectTitleEn ? response.res.projectTitleEn : this.projectTitle;
                this.commencementDate = response.res.expCommencementDate ? response.res.expCommencementDate : this.commencementDate;
                this.completionDate = response.res.expCompletionDate ? response.res.expCompletionDate : this.completionDate;
                this.rtappId = response.res.id ? response.res.id : null;
                this.rtappUuid = response.res.uuid ? response.res.uuid : null;
                this.getWorkPlanByTappMasterId(this.rtappId);
                this.getFiscalYearList();
            }


        )
    }

    openDeleteDialog(attachmentId) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = false;
        dialogConfig.width = ConfirmDialogConstant.WIDTH;
        dialogConfig.height = ConfirmDialogConstant.HEIGHT;
        dialogConfig.panelClass = ConfirmDialogConstant.PANEL_CLASS;
        dialogConfig.data = {message: ConfirmDialogConstant.DELETE_CONFIRMATION};
        const dialogRef = this.dialog.open(SubmitConfirmationDialogComponent, dialogConfig);

        dialogRef.componentInstance.closeEventEmitter.subscribe(res => {
            if (res) {
                this.delete();
            }
            dialogRef.close(true);
        });
    }

    getWorkPlanByTappMasterId(tappMasterId) {
        this.tappWorkScheduleService.getWorkinngScheduleList(tappMasterId).subscribe(
            res => {
                if (res.status && res.res) {
                    this.tappWorkPlanList = res.res;
                } else {
                    this.addRow(0);
                }
            },
            err => {
                this.addRow(0);
                console.log('Get Pd List By DppTappMasterUuid err', err);
            }
        )
    }

    changeTaskDetails(){
        this.isDataEmpty = false;
    }

    addRow(index: number) {

        if (this.tappWorkPlanList.length>0 && !this.tappWorkPlanList[index].taskDetails) {
            this.sanckbar.openErrorSnackBarWithMessage("Please Fill Task Breakdown!", "OK");
            this.isDataEmpty = true;
            return;
        }

        this.tappWorkPlanObj = new ImplementationWorkScheduleModel();
        this.tappWorkPlanObj.rtappMasterId = this.rtappId;
        this.tappWorkPlanObj.groupId = moment().valueOf();

        this.tappWorkPlanList.push(this.tappWorkPlanObj)
    }

    deleteRow(element) {
        let fIndex = this.tappWorkPlanList.findIndex(data => data==element);
        if (!element.id) {
            this.tappWorkPlanList.splice(fIndex, 1);
            if (fIndex == this.tappWorkPlanList.length){
                this.isDataEmpty = false;
            }
            if(fIndex == 0){
                this.addRow(fIndex);
            }
            return;
        }

        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = false;
        dialogConfig.width = ConfirmDialogConstant.WIDTH;
        dialogConfig.height = ConfirmDialogConstant.HEIGHT;
        dialogConfig.panelClass = ConfirmDialogConstant.PANEL_CLASS;
        dialogConfig.data = { message: ConfirmDialogConstant.MESSAGE };
        const dialogRef = this.dialog.open(
            SubmitConfirmationDialogComponent,
            dialogConfig
        );
        dialogRef.componentInstance.closeEventEmitter.subscribe((res) => {
            if (res) {
                this.tappWorkScheduleService.deleteById(element.id).subscribe(
                    res => {
                        if (res.status) {
                            this.sanckbar.openSuccessSnackBarWithMessage(res.message, "Ok");
                            this.tappWorkPlanList.splice(fIndex, 1);
                            if(fIndex == 0){
                                this.addRow(fIndex);
                            }
                        } else {
                            this.sanckbar.openWarnSnackBarWithMessage('Delete Filed !', 'ERROR');
                            console.log('work plan delete res', res);
                        }
                    },
                    err => {
                        this.sanckbar.openWarnSnackBarWithMessage('Error Occured While Delete!', 'ERROR');
                        console.log('work plan delete err', err);
                    }
                )
            }
            dialogRef.close(true);
        });

    }

    createWorkPlan() {

        this.spinner = true;

        this.tappWorkPlanList.forEach(element => {
            if (!element.taskDetails) {
                this.isDataEmpty = true;
                return;
            }
        });
        if (this.isDataEmpty) {
            this.sanckbar.openErrorSnackBarWithMessage("Please Fill Task Breakdown!", "OK");
            this.spinner = false;
            return;
        }

        this.tappWorkScheduleService.createWorkPlan(this.tappWorkPlanList).subscribe(
            res => {
                if (res.status) {
                    this.sanckbar.openSuccessSnackBarWithMessage(res.message, "OK");
                    this.getWorkPlanByTappMasterId(this.rtappId);
                } else {
                    this.sanckbar.openErrorSnackBarWithMessage('Work Plan Save Failed !', "ERROR");
                    console.log('work plan save res', res);
                }
                this.spinner = false;
            },
            err => {
                this.sanckbar.openErrorSnackBarWithMessage('Error Occurred While Work Plan Save!', "ERROR");
                console.log('work plan save err', err);
                this.spinner = false;
            }
        )
    }

    getFiscalYearList() {

        const a = new Date(this.commencementDate);
        const b = new Date(this.completionDate);

        let fYear = a.getFullYear();
        let lYear = b.getFullYear();

        if (a.getMonth() < 6) {
            fYear = a.getFullYear() - 1;
        }
        if (b.getMonth() > 5) {
            lYear = b.getFullYear() + 1;
        }

        let total = lYear - fYear;
        let startingYear = fYear;

        while (total > 0) {
            let nextYear = (startingYear + 1);
            this.fiscalYearList.push({ fiscalYear: (startingYear + "-" + nextYear) });
            startingYear += 1;
            total -= 1;
        }

        this.fiscalYearList.forEach(fYear => {

            fYear.quarterList = [];
            let str = `${fYear.fiscalYear}`;
            let yearList = str.split("-");

            let firstQuarter = { 'strDate': new Date(`${yearList[0]}-07-01`), 'endDate': new Date(`${yearList[0]}-09-30`) }
            let secondQuarter = { 'strDate': new Date(`${yearList[0]}-10-01`), 'endDate': new Date(`${yearList[0]}-12-31`) }
            let thirdQuarter = { 'strDate': new Date(`${yearList[1]}-01-01`), 'endDate': new Date(`${yearList[1]}-03-31`) }
            let fourthQuarter = { 'strDate': new Date(`${yearList[1]}-04-01`), 'endDate': new Date(`${yearList[1]}-06-30`) }

            fYear.quarterList.push(firstQuarter);
            fYear.quarterList.push(secondQuarter);
            fYear.quarterList.push(thirdQuarter);
            fYear.quarterList.push(fourthQuarter);

        });

    }

    selectQuarter(event, obj, selectStr){
        if (event.checked){
            obj.selectedQuarter = obj.selectedQuarter ? obj.selectedQuarter + selectStr : selectStr;
        }else{
            obj.selectedQuarter = obj.selectedQuarter.replace(selectStr,'');
        }
    }

    getAnnexureIVFile() {
        this.tappWorkScheduleService.getData('/get-annexure-two-file/'+this.rtappUuid).subscribe((res) => {
            if (res.attachment) {
                this.formInformation = res;
                this.isAttachmentEnable = true;
                this.attachmentId = res.attachment.id;
                this.attachmentName = res.attachment.name;
                this.displayFileName = "attachment/view/" + res.attachment.fileName;
            } else {
                this.isAttachmentEnable = false;
                this.attachmentId = null;
                this.attachmentName = '';
            }
        });
    }

    uploadFile(file: FileList): any {
        this.spinner = true;
        this.attachmentName = '';
        this.file = file.item(0);

        const formData = new FormData();
        formData.append('attachment', this.file);
        formData.append('rtappId', this.rtappId.toString());
        formData.append('rtappUuid', this.rtappUuid);
        this.spinner = true;

        this.tappWorkScheduleService.saveData('/save', formData).subscribe((res) => {
            this.sanckbar.openSuccessSnackBarWithMessage('Attachment Successfully Save', 'Ok');
            this.isAttachmentEnable = true;
            this.attachmentId = res.attachment.id;
            this.displayFileName = "attachment/view/" + res.attachment.fileName;
            this.spinner = false;
        }, error => {
            this.sanckbar.openErrorSnackBarWithMessage('Error File is not save', 'Ok');
            this.spinner = false;
        });
    }

    delete() {
        this.spinner = true;
        this.tappWorkScheduleService.deleteFile('/delete/' + this.attachmentId).subscribe((res) => {
            this.formInformation = res;
            if (res > 0) {
                this.matSnackBar.openSuccessSnackBarWithMessage("File has been deleted!", "Ok");
                this.isAttachmentEnable = false;
                this.attachmentId = null;
                this.attachmentName = '';
                this.file = null;
            }
            this.spinner = false;
        });
    }

    download() {
        this.fileUploadService.downloadAttachmentInRdppService(this.displayFileName);
    }
}
