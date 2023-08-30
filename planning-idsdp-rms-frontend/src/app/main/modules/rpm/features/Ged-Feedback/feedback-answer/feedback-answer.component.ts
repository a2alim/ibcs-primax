import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators, NgForm} from '@angular/forms';
//----Lng Translation----
import { FuseTranslationLoaderService } from 'app/main/core/services/translation-loader.service';
import {locale as lngEnglish} from '../i18n/en';
import {locale as lngBangla} from '../i18n/bn';
import { ApiService } from 'app/main/core/services/api/api.service';
import { ToastrService } from 'ngx-toastr';
import { GlobalValidationServiceService } from 'app/main/core/services/global-validation-service.service';
import { FiscalYearWiseSectorSubSector } from '../../../models/FiscalYearWiseSectorSubSector';
import { DEFAULT_SIZE } from 'app/main/core/constants/constant';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SnackbarHelper } from 'app/main/core/helper/snackbar.helper';
import { environment } from 'environments/environment';
import { DataComService } from 'app/main/core/services/data-com/data-com.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { previousIcon, refreshIcon, saveIcon ,downloadIcon} from '../../../constants/button.constants';
import { CreateLetterGedServiceService } from '../../../services/create-letter-ged-service.service';
import { ConfirmDialogConstant } from 'app/main/shared/constant/confirm.dialog.constant';
import { SubmitConfirmationDialogComponent } from 'app/main/shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component';
import { GedBeedbackSeviceService } from '../../../services/ged-feedback-sevice.service';

@Component({
  selector: 'app-feedback-answer',
  templateUrl: './feedback-answer.component.html',
  styleUrls: ['./feedback-answer.component.scss']
})
export class FeedbackAnswerComponent implements OnInit {
/*----Button---*/
refreshIcon = refreshIcon; saveIcon = saveIcon; previousIcon = previousIcon;downloadIcon=downloadIcon;

/*----/Button---*/

@ViewChild('inputForm') inputForm: NgForm;
subscription: Subscription;

formTypes: any = [];
spinner:boolean = false;
frmGroup: FormGroup;
config: { timeOut: 5000; closeButton: true; positionClass: 'toast-top-right'; enableHtml: true; };
formTitle = 'Save'; //Edit
attachment:string= null;
fiscalYearListFull: any[] = [];
fiscalYearList: any[] = [];
fileToUpload: { id: number, file: File }[] = [];
editData:any=null;
change:string='false';
fileUrl:string;
isDOwnloadable:boolean=false;

constructor(
    private formBuilder: FormBuilder,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    private api: ApiService,
    private toastr: ToastrService,
    private globalVal: GlobalValidationServiceService,
    private matSnackBar : SnackbarHelper,
    private dialog: MatDialog,
    private dataCom: DataComService,
    private router:Router,
    private gedService:CreateLetterGedServiceService,
    private feedbackService:GedBeedbackSeviceService,
    ) {
    
    // Language translations
    this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);

}

ngOnInit(): void {
  this.formTitle = 'Add';
  this.frmGroup = this.formBuilder.group({
    uuid:[''],
    id:[],
    stFiscalYearId:['', [this.globalVal.trimValidator('Fiscal year')]],
    sendTo:['', [this.globalVal.trimValidator('Send to')]],
    letterBodyContent:['', [this.globalVal.trimValidator('Send to')]],
    subject:['', [this.globalVal.trimValidator('Subject')]],
    sendingStatus:[1],
    fileDownloadUrl:[''],
    bucketName:[''],
    fileName:[''],
    mode:[''],
});

this.fiscalYearList=this.feedbackService.fiscalYearList;
this.editData=this.feedbackService.data;
this.change='false';
if(this.editData!=null){
this.frmGroup.patchValue(this.editData); 
if(this.editData.fileDownloadUrl!==""){
  this.fileUrl=this.editData.fileDownloadUrl;
  this.isDOwnloadable=true;
}




}}

back(){
  this.router.navigate(['/ged-feedback-list']);
}

downloadFile(){
  this.feedbackService.download(this.fileUrl).subscribe(
    res => {
      console.log(res)
    }
  );

}


 openDialog() {
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

send(){
  this.frmGroup.patchValue({sendingStatus:'2'});
  this.gedService.updateData(this.frmGroup.value).subscribe(
    res => {
      if (res.success) {
        this.toastr.success("Sending Success", "", this.config);
        this.router.navigate(['/ged-list']);
       // this.getListData();
      } else {
        this.toastr.error(res.message, "", this.config);
      }
    },
    err => {
      this.toastr.error('Http Error Occurred !.', "", this.config);
    }
  )
  
}

}
