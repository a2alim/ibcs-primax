import {Component, EventEmitter, Inject, OnInit} from '@angular/core';
import {MatDialog, MatDialogConfig, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {EnothiDakSubmissionService} from '../../../core/services/enothi-dak-submission.service';
import {SnackbarHelper} from '../../../core/helper/snackbar.helper';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {FuseTranslationLoaderService} from '../../../core/services/translation-loader.service';
import {locale as lngEnglish} from './i18n/en';
import {locale as lngBangla} from './i18n/bn';
import { ApplicationSubmission } from '../../model/application-submission.model';
import {OK, SUCCESSFULLY_DAK_SUBMITTED, SUCCESSFULLY_DAK_SUBMITTED_BN} from 'app/main/core/constants/message';
import { ConfirmDialogConstant } from '../../constant/confirm.dialog.constant';
import { SubmitConfirmationDialogComponent } from '../submit-confirmation-dialog/submit-confirmation-dialog.component';
import { GenerateReport } from '../../model/generate-reports.model';
import { ReportGenerateService } from '../../services/report-generate.service';
import { environment } from 'environments/environment';
import { FileUploadService } from 'app/main/core/services/file-upload.service';
import {PscWorkingPlanService} from "../../../modules/dpp-tapp-management/services/psc-working-plan.service";

@Component({
    selector: 'app-send-to-dak',
    templateUrl: './send-to-dak.component.html',
    styleUrls: ['./send-to-dak.component.scss']
})
export class SendToDakComponent implements OnInit {

    closeEventEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();
    form: FormGroup;
    data: { source: 'pc' | 'dpp' | 'tapp' | 'rdpp' | 'rtapp' | 'fs' , sourceId: string, pcUuid: string, reportType: string, srcUserGroup: string };
    submitted:boolean = true;

    editorConfig = {
        toolbar: [
            ['Bold', 'Italic', 'Underline', 'Strike', 'Font', 'FontSize', 'TextColor', 'BGColor',
                'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', 'BulletedList', 'Indent', 'Outdent',
                'Superscript', 'Link', 'Table', 'RemoveFormat']
        ],
    }

    applicationSubmission : ApplicationSubmission = new ApplicationSubmission();

    reportList:GenerateReport[] = [];
    reportSavedSuccesful: boolean = false;
    annexureReport:Array<any> = new Array();
    sendReportList:Array<{'name':string,'url':string}> = new Array();
    isWorkingPaperCreated: boolean = false;

    constructor(@Inject(MAT_DIALOG_DATA) data: { source: 'pc' | 'dpp' | 'tapp' | 'rdpp' | 'rtapp' | 'fs', sourceId: string, pcUuid: string, reportType: string, srcUserGroup: string },
                private _fuseTranslationLoaderService: FuseTranslationLoaderService,
                private enothiDakSubmissionService: EnothiDakSubmissionService,
                private snackbarHelper: SnackbarHelper,
                private matDialog: MatDialog,
                private reportGenerateService: ReportGenerateService,
                private fileUploadService:  FileUploadService,
                private pscWorkingPlanService: PscWorkingPlanService,
    ) {
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
        this.data = data;
    }

    ngOnInit(): void {
        this.populateForm();
        this.getReportsList();
        this.getWorkingPaper();
    }

    private populateForm() {
        this.form = new FormGroup({
            applicationSubject: new FormControl('', [Validators.required]),
            data: new FormControl('', [Validators.required]),
            // observer: new FormControl('', [Validators.required]),
        });
    }

    /*
    sendProjectConceptToNothi(applicationSubmission) {
        this.submitted = false;
        let appSubmission = this.applicationSubmission;
        appSubmission.projectConceptUuid = this.data.pcUuid;
        if(this.applicationSubmission.dppTappUuid!=null){
            this.reportGenerateService.getAnnexxureReport(appSubmission).subscribe(res=>{
                this.annexureReport = res;
                this.getAnnexureReports();
                this.enothiDakSubmissionService.submitDak(applicationSubmission).subscribe(dakRes => {
                    if (dakRes) {
                        if(dakRes.status=='success') {
                            this.closeEventEmitter.emit(true);
                            this.snackbarHelper.openSuccessSnackBarWithMessage(SUCCESSFULLY_DAK_SUBMITTED, OK);
                        } else if(dakRes.status=='error') {
                            this.snackbarHelper.openErrorSnackBarWithMessage(dakRes.message, OK)
                        }
                    }
                },
                (error)=>{
                    this.snackbarHelper.openErrorSnackBarWithMessage(error.message, OK);
                });
            },
            (error)=>{
            this.snackbarHelper.openErrorSnackBarWithMessage('Annexure Report attachment got failed', OK);
            });
        }
        else{
            this.enothiDakSubmissionService.submitDak(applicationSubmission).subscribe(res => {
                if (res) {
                    if(res.status=='success') {
                        this.closeEventEmitter.emit(true);
                        this.snackbarHelper.openSuccessSnackBarWithMessage(SUCCESSFULLY_DAK_SUBMITTED, OK);
                    }
                    else if(res.status=='error') {
                        this.snackbarHelper.openErrorSnackBarWithMessage(res.message, OK)
                    }
                }
            },
            (error)=>{
                this.snackbarHelper.openErrorSnackBarWithMessage(error.message, OK);
            });
        }
    }
    */

    sendProjectConceptToNothi(applicationSubmission) {
        this.submitted = false;
        let appSubmission = this.applicationSubmission;
        appSubmission.projectConceptUuid = this.data.pcUuid;
        if(this.applicationSubmission.dppTappUuid!=null){
            this.enothiDakSubmissionService.submitDak(applicationSubmission).subscribe(dakRes => {
                if (dakRes) {
                    if(dakRes.status=='success') {
                        this.closeEventEmitter.emit(true);
                        this.snackbarHelper.openSuccessSnackBarWithMessageEnBn(SUCCESSFULLY_DAK_SUBMITTED, SUCCESSFULLY_DAK_SUBMITTED_BN);
                    } else if(dakRes.status=='error') {
                        this.snackbarHelper.openErrorSnackBarWithMessage(dakRes.message, OK)
                    }
                }
            },
            (error)=>{
                this.snackbarHelper.openErrorSnackBarWithMessage(error.message, OK);
            });
        } else {
            this.enothiDakSubmissionService.submitDak(applicationSubmission).subscribe(res => {
                if (res) {
                    if (res.status=='success') {
                        this.closeEventEmitter.emit(true);
                        this.snackbarHelper.openSuccessSnackBarWithMessageEnBn(SUCCESSFULLY_DAK_SUBMITTED, SUCCESSFULLY_DAK_SUBMITTED_BN);
                    } else if (res.status=='error') {
                        this.snackbarHelper.openErrorSnackBarWithMessage(res.message, OK)
                    }
                }
            },
            (error)=>{
                this.snackbarHelper.openErrorSnackBarWithMessage(error.message, OK);
            });
        }
    }

    submit() {
        if(this.form.valid){
            this.populateApplicationSubmissionModel();
            if (this.data.source == 'pc') {
                this.applicationSubmission.projectConceptUuid = this.data.sourceId;
            } else if (this.data.source == 'fs') {
                this.applicationSubmission.feasibilityUuid = this.data.sourceId;
            } else if (this.data.source == 'tapp') {
                this.applicationSubmission.tappUuid = this.data.sourceId;
            } else if (this.data.source == 'rdpp') {
                this.applicationSubmission.rdppUuid = this.data.sourceId;
            } else if (this.data.source == 'rtapp') {
                this.applicationSubmission.rtappUuid = this.data.sourceId;
            } else {
                this.applicationSubmission.dppTappUuid = this.data.sourceId;
            }

            const dialogConfig = new MatDialogConfig();
            dialogConfig.disableClose = false;
            dialogConfig.autoFocus = false;
            dialogConfig.width = ConfirmDialogConstant.WIDTH;
            dialogConfig.height = ConfirmDialogConstant.HEIGHT;
            dialogConfig.panelClass = ConfirmDialogConstant.PANEL_CLASS;
            if(this.data.reportType=='en')
                dialogConfig.data = { message: ConfirmDialogConstant.SUBMIT_DAAK };
            else
                dialogConfig.data = { message: ConfirmDialogConstant.SUBMIT_DAAK_BN };
            const dialogRef = this.matDialog.open(SubmitConfirmationDialogComponent, dialogConfig);

            this.applicationSubmission.workingPaperCreated = this.isWorkingPaperCreated;
            this.applicationSubmission.reportList=[];
            this.applicationSubmission.reportList = (this.sendReportList);

            dialogRef.componentInstance.closeEventEmitter.subscribe(res => {
                if (res)
                    this.applicationSubmission.ppsUrl = environment.ibcs.ppsUrl;
                    this.sendProjectConceptToNothi(this.applicationSubmission);
                dialogRef.close(true);
            })
        }
       else{
           this.snackbarHelper.openWarnSnackBarWithMessage('All Input is required', OK);
       }
    }


    saveReport(){
        this.populateApplicationSubmissionModel();
        this.getUuidByModuleWise();
         this.reportSavedSuccesful = true;
        // const generatedReport = {'name':'TAPP Report','url':'http://202.161.191.131:9403/pps-pc/attachment/view/1628148645918_sample.pdf','createdOn':new Date()};
        this.reportGenerateService.generateReport(this.applicationSubmission).subscribe(res=>{
            if(res)
                this.reportList.unshift(res);
            else{
                this.snackbarHelper.openErrorSnackBarWithMessage('Report is not generated', OK);
                this.reportSavedSuccesful = false;
            }

        }, (error)=>{
            this.snackbarHelper.openErrorSnackBarWithMessage('Report is not generated', OK);
            this.reportSavedSuccesful = false;
        });

    }

    getReportsList(){
        //const generatedReport =  {'name':'DPP Report','url':'http://202.161.191.131:9403/pps-pc/attachment/view/1628148645918_sample.pdf','createdOn':new Date('23/05/2021')};
        this.reportGenerateService.getReportList(this.data.pcUuid, this.data.source).subscribe(res=>{
            this.reportList = res;
        });
        //this.reportList.push(generatedReport);
    }

    changeRadio(e, selectedReport){
        this.applicationSubmission.name=selectedReport.name;
        this.applicationSubmission.url=environment.ibcs.ppsReportEndPoint + selectedReport.urlPath;
        this.sendReportList = [];
        this.sendReportList.push({
            'name':selectedReport.name,
            'url':environment.ibcs.ppsReportEndPoint + selectedReport.urlPath
        });
    }

    getUuidByModuleWise(){
        if (this.data.source == 'pc')
            this.applicationSubmission.projectConceptUuid = this.data.sourceId;
        else if (this.data.source == 'fs')
            this.applicationSubmission.feasibilityUuid = this.data.sourceId;
        else if(this.data.source == 'tapp')
            this.applicationSubmission.tappUuid = this.data.sourceId;
        else if(this.data.source == 'rdpp')
            this.applicationSubmission.rdppUuid = this.data.sourceId;
        else if(this.data.source == 'rtapp')
            this.applicationSubmission.rtappUuid = this.data.sourceId;
        else
            this.applicationSubmission.dppTappUuid = this.data.sourceId;;
    }

    getUrl(path){
        let url = environment.ibcs.ppsReportEndPoint + path;
        this.fileUploadService.downloadAttachmentFromReport(path);
    }

    populateApplicationSubmissionModel(){
        this.applicationSubmission.sourceModule = this.data.source;
        this.applicationSubmission.application_subject = this.form.value.applicationSubject;
        this.applicationSubmission.data = this.form.value.data.replace(/"/g, "'");
        this.applicationSubmission.reportType = this.data.reportType;
        this.applicationSubmission.projectConceptUuid = this.data.pcUuid;
        this.applicationSubmission.srcUserGroup = this.data.srcUserGroup;
    }

    getWorkingPaper() {
        if (this.data.source == 'dpp' || this.data.source == 'tapp') {
            this.pscWorkingPlanService.getByPcId(this.data.pcUuid, 'PSC', 'MINISTRY-DESK').subscribe(res => {
                if (res) {
                    this.isWorkingPaperCreated = true;
                } else {
                    this.isWorkingPaperCreated = false;
                }
            });
        }
    }

    getAnnexureReports(){
       //this.annexureReport =  this.reportDataService.getAnnexureGoodWorksServiceReport(this.data.pcUuid,this.data.reportType);
       this.annexureReport.forEach(ann=>{
            const annexxure = {
               "name":ann.name,
               "url":environment.ibcs.ppsReportEndPoint + ann.urlPath
            }
            this.sendReportList.push(annexxure);
        });
    }
}
