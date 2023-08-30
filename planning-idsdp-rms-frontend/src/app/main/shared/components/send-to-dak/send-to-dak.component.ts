import {Component, EventEmitter, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig} from '@angular/material/dialog';
//import {EnothiDakSubmissionService} from '../../../core/services/enothi-dak-submission.service';
import {SnackbarHelper} from '../../../core/helper/snackbar.helper';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {FuseTranslationLoaderService} from '../../../core/services/translation-loader.service';
import {locale as lngEnglish} from './i18n/en';
import {locale as lngBangla} from './i18n/bn';
import {OK} from 'app/main/core/constants/message';
import {ConfirmDialogConstant} from '../../constant/confirm.dialog.constant';
import {SubmitConfirmationDialogComponent} from '../submit-confirmation-dialog/submit-confirmation-dialog.component';
//import { GenerateReport } from '../../model/generate-reports.model';
//import { ReportGenerateService } from '../../services/report-generate.service';
import {ApplicationSubmission} from '../../model/application-submission.model';

//import { FileUploadService } from 'app/main/core/services/file-upload.service';

@Component({
    selector: 'app-send-to-dak',
    templateUrl: './send-to-dak.component.html',
    styleUrls: ['./send-to-dak.component.scss']
})
export class SendToDakComponent implements OnInit {

    closeEventEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();
    form: FormGroup;
    data: { source: 'pc' | 'dpp' | 'tapp' | 'fs', sourceId: string, pcUuid: string, reportType: string, srcUserGroup: string };
    submitted:boolean = true;

    editorConfig = {
        toolbar: [
            ['Bold', 'Italic', 'Underline', 'Strike', 'Font', 'FontSize', 'TextColor', 'BGColor',
                'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', 'BulletedList', 'Indent', 'Outdent',
                'Superscript', 'Link', 'Table', 'RemoveFormat']
        ],
    }


    applicationSubmission : ApplicationSubmission = new ApplicationSubmission();

    //reportList:GenerateReport[] = [];
    reportSavedSuccesful: boolean = false;

    constructor(@Inject(MAT_DIALOG_DATA) data: { source: 'pc' | 'dpp' | 'tapp' | 'fs', sourceId: string, pcUuid: string, reportType: string, srcUserGroup: string },
                private _fuseTranslationLoaderService: FuseTranslationLoaderService,
                //private enothiDakSubmissionService: EnothiDakSubmissionService,
                private snackbarHelper: SnackbarHelper,
                private matDialog: MatDialog,
                //private reportGenerateService: ReportGenerateService,
                //private fileUploadService:  FileUploadService
    ) {
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
        this.data = data;
    }

    ngOnInit(): void {
        this.populateForm();
        this.getReportsList();
    }

    private populateForm() {
        this.form = new FormGroup({
            applicationSubject: new FormControl('', [Validators.required]),
            data: new FormControl('', [Validators.required]),
            // observer: new FormControl('', [Validators.required]),
        });
    }

    sendProjectConceptToNothi(applicationSubmission) {
        this.submitted = false;
        /*this.enothiDakSubmissionService.submitDak(applicationSubmission).subscribe(res => {
            console.log(res);
            if (res) {
                if(res.status=='success') {
                    this.closeEventEmitter.emit(true);
                    this.snackbarHelper.openSuccessSnackBarWithMessage(SUCCESSFULLY_DAK_SUBMITTED, OK);
                }
                else if(res.status=='error')
                    this.snackbarHelper.openWarnSnackBarWithMessage(res.message, OK)
            }

        },
        (error)=>{
            this.snackbarHelper.openErrorSnackBarWithMessage('Error in communicating with E-Nothi', OK);
        });*/
    }

    submit() {
        if(this.form.valid){
          
            this.populateApplicationSubmissionModel();
            if(this.applicationSubmission.url!=null){
                let pc;
                if (this.data.source == 'pc')
                    this.applicationSubmission.projectConceptUuid = this.data.sourceId;
                else if (this.data.source == 'fs'){
                    this.applicationSubmission.feasabilityUuid = this.data.sourceId;
                    this.applicationSubmission.projectConceptUuid = pc;
                }   
                else if (this.data.source == 'tapp'){
                    this.applicationSubmission.tappUuid = this.data.sourceId;
                    this.applicationSubmission.projectConceptUuid = pc;
                }
                else{
                    this.applicationSubmission.dppTappUuid = this.data.sourceId;;
                    this.applicationSubmission.projectConceptUuid = pc;
                }

                
                console.log(this.applicationSubmission);

                const dialogConfig = new MatDialogConfig();
                dialogConfig.disableClose = false;
                dialogConfig.autoFocus = false;
                dialogConfig.width = ConfirmDialogConstant.WIDTH;
                dialogConfig.height = ConfirmDialogConstant.HEIGHT;
                dialogConfig.panelClass = ConfirmDialogConstant.PANEL_CLASS;
                //dialogConfig.data = { message: ConfirmDialogConstant.SUBMIT_DAAK };
                const dialogRef = this.matDialog.open(SubmitConfirmationDialogComponent, dialogConfig);

                dialogRef.componentInstance.closeEventEmitter.subscribe(res => {
                    if (res)
                        this.sendProjectConceptToNothi(this.applicationSubmission);
                    dialogRef.close(true);
                })
            }
            else{
                this.snackbarHelper.openWarnSnackBarWithMessage('Please select a report', OK);
            }

            
        }
       else{
           this.snackbarHelper.openWarnSnackBarWithMessage('All Input is required', OK);
       }




    }


    saveReport(){
        this.populateApplicationSubmissionModel();
        this.getUuidByModuleWise();
         this.reportSavedSuccesful = true;
        console.log(this.applicationSubmission);
        // const generatedReport = {'name':'TAPP Report','url':'http://202.161.191.131:9403/pps-pc/attachment/view/1628148645918_sample.pdf','createdOn':new Date()};
        /*this.reportGenerateService.generateReport(this.applicationSubmission).subscribe(res=>{
            console.log(res);
            if(res)
                this.reportList.unshift(res);
            else{
                this.snackbarHelper.openErrorSnackBarWithMessage('Report is not generated', OK);
                this.reportSavedSuccesful = false;
            }
          
        }, (error)=>{
            console.log(error);
            this.snackbarHelper.openErrorSnackBarWithMessage('Report is not generated', OK);
            this.reportSavedSuccesful = false;
        });*/
        
    }

    getReportsList(){
        //const generatedReport =  {'name':'DPP Report','url':'http://202.161.191.131:9403/pps-pc/attachment/view/1628148645918_sample.pdf','createdOn':new Date('23/05/2021')};
        // this.reportGenerateService.getReportList(this.data.pcUuid, this.data.source).subscribe(res=>{
        //     this.reportList = res;
        //     console.log(this.reportList);
        // });
        //this.reportList.push(generatedReport);
    }

    changeRadio(e, selectedReport){
        console.log(e);
        console.log(selectedReport);
        this.applicationSubmission.name=selectedReport.name;
        //this.applicationSubmission.url=environment.ibcs.ppsReportEndPoint + selectedReport.urlPath;
        console.log(this.applicationSubmission);
    }

    getUuidByModuleWise(){
        if (this.data.source == 'pc')
            this.applicationSubmission.projectConceptUuid = this.data.sourceId;
        else if (this.data.source == 'fs')
            this.applicationSubmission.feasabilityUuid = this.data.sourceId;
        else if(this.data.source == 'tapp')
            this.applicationSubmission.tappUuid = this.data.sourceId;
        else
            this.applicationSubmission.dppTappUuid = this.data.sourceId;;
    }

    getUrl(path){
        //let url = environment.ibcs.ppsReportEndPoint + path;
        //console.log(url);
        //this.fileUploadService.downloadAttachmentFromReport(path);
    }

    populateApplicationSubmissionModel(){
        this.applicationSubmission.sourceModule = this.data.source;
        this.applicationSubmission.application_subject = this.form.value.applicationSubject;
        this.applicationSubmission.data = this.form.value.data;
        this.applicationSubmission.reportType = this.data.reportType;
        this.applicationSubmission.projectConceptUuid = this.data.pcUuid;
        this.applicationSubmission.srcUserGroup = this.data.srcUserGroup;
    }
}
