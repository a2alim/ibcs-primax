import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FuseTranslationLoaderService } from 'app/main/core/services/translation-loader.service';
import {locale as lngEnglish} from './i18n/en';
import {locale as lngBangla} from './i18n/bn';
import { SnackbarHelper } from 'app/main/core/helper/snackbar.helper';
import { OK, SUCCESSFULLY_DAK_SUBMITTED } from 'app/main/core/constants/message';
import { ApplicationSubmission } from '../../model/application-submission.model';
import { EnothiDakSubmissionService } from 'app/main/core/services/enothi-dak-submission.service';
import { ReportGenerateService } from '../../services/report-generate.service';
import { CommentSourceEnum } from 'app/main/modules/project-concept-management/enums/comment-source.enum';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-send-to-dak-enothi',
  templateUrl: './send-to-dak-enothi.component.html',
  styleUrls: ['./send-to-dak-enothi.component.scss']
})
export class SendToDakEnothiComponent implements OnInit {

  closeEventEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();
  form: FormGroup;
  data: { source: 'pc' | 'dpp' | 'tapp' | 'fs', sourceId: string, pcUuid: string, reportType: string, srcUserGroup: string,
  projectType: number | null, sectorDivision : number,gob : boolean,isForeignAi : boolean,isFsRequired : boolean,projectName : string,
  sector : number,lowAmount : number,highAmount : number,status : string, SourceEnum: CommentSourceEnum.DPP
        };
  submitted:boolean = true;

  constructor(@Inject(MAT_DIALOG_DATA) data:{source: 'pc' | 'dpp' | 'tapp' | 'fs', sourceId: string, pcUuid: string, reportType: string, srcUserGroup: string,
  projectType: number | null, sectorDivision : number,gob : boolean,isForeignAi : boolean,isFsRequired : boolean,projectName : string,
  sector : number,lowAmount : number,highAmount : number,status : string, SourceEnum: CommentSourceEnum.DPP},
              private _fuseTranslationLoaderService: FuseTranslationLoaderService,
              private snackbarHelper: SnackbarHelper,
              private enothiDakSubmissionService: EnothiDakSubmissionService,
              private reportGenerateService: ReportGenerateService) {
    this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    this.data = data;
   }

   applicationSubmission : ApplicationSubmission = new ApplicationSubmission();
   reportSaveRequestDto: {};
   sendReportList:Array<{'name':string,'url':string}> = new Array();

  ngOnInit(): void {
    this.populateForm();
  }
  private populateForm() {
      this.form = new FormGroup({
          applicationSubject: new FormControl('', [Validators.required]),
          data: new FormControl('', [Validators.required]),
          // observer: new FormControl('', [Validators.required]),
      });
  }

  submit(){
    if(this.form.valid){
      this.reportSaveRequestDto = {
        projectConceptUuid:null,
        feasibilityUuid:null,
        dppTappUuid:null,
        dppUuid:null,
        tappUuid:null,
        sourceModule:'dpp',
        reportType:null
      }
      const obj={
        projectType: this.data.projectType,
        sectorDivision : this.data.sectorDivision,
        gob : this.data.gob,
        isForeignAi : this.data.isForeignAi,
        isFsRequired : this.data.isFsRequired,
        projectName : this.data.projectName,
        sector : this.data.sector,
        lowAmount : this.data.lowAmount,
        highAmount : this.data.highAmount,
        status : this.data.status,
        reportSaveRequestDto : this.reportSaveRequestDto
      };
      this.reportGenerateService.saveEcnecDppTappList(obj).subscribe(res=>{
        this.populateApplicationSubmissionModel();

          this.sendReportList.push({
            'name':res.name,
            'url':res.urlPath
          })

        this.applicationSubmission.reportList=this.sendReportList;
        this.sendProjectConceptToNothi(this.applicationSubmission);
      },
      (error)=>{
        this.snackbarHelper.openWarnSnackBarWithMessage('Error in creating ECNEC DPP/TAPP report', OK)
      })
    }
    else{
      this.snackbarHelper.openWarnSnackBarWithMessage('All Input is required', OK);
    }


  }
  populateApplicationSubmissionModel(){
    this.applicationSubmission.sourceModule = this.data.source;
    this.applicationSubmission.application_subject = this.form.value.applicationSubject;
    this.applicationSubmission.data = this.form.value.data;
    this.applicationSubmission.reportType = this.data.reportType;
    this.applicationSubmission.projectConceptUuid = this.data.pcUuid;
    this.applicationSubmission.srcUserGroup = this.data.srcUserGroup;
}
  sendProjectConceptToNothi(applicationSubmission){
    this.enothiDakSubmissionService.submitDak(this.applicationSubmission).subscribe(res => {
      if (res) {
          if(res.status=='success') {
              this.closeEventEmitter.emit(true);
              this.snackbarHelper.openSuccessSnackBarWithMessage(SUCCESSFULLY_DAK_SUBMITTED, OK);
          }
          else if(res.status=='error')
              this.snackbarHelper.openErrorSnackBarWithMessage(res.message, OK)
      }

  },
  (error)=>{
      this.snackbarHelper.openErrorSnackBarWithMessage(error.message, OK);
  });

  }



}
