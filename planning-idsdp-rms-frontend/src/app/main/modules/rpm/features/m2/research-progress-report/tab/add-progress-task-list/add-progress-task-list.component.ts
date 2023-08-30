import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SnackbarHelper } from 'app/main/core/helper/snackbar.helper';
import { ApiService } from 'app/main/core/services/api/api.service';
import { DataComService } from 'app/main/core/services/data-com/data-com.service';
import { GlobalValidationServiceService } from 'app/main/core/services/global-validation-service.service';
//----Lng Translation----
import { FuseTranslationLoaderService } from 'app/main/core/services/translation-loader.service';
import { environment } from 'environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { previousIcon, refreshIcon, saveIcon } from '../../../../../constants/button.constants';
import { locale as lngBangla } from '../../i18n/bn';
import { locale as lngEnglish } from '../../i18n/en';


@Component({
  selector: 'app-add-progress-task-list',
  templateUrl: './add-progress-task-list.component.html'
})
export class AddProgressTaskListComponent implements OnInit {

  /*----Button---*/
  refreshIcon = refreshIcon; saveIcon = saveIcon; previousIcon = previousIcon;
  /*----/Button---*/
  
  @ViewChild('inputForm') inputForm: NgForm;
  subscription: Subscription;

  formTypes: any = [];
  spinner:boolean = false;
  frmGroup: FormGroup;
  config: { timeOut: 5000; closeButton: true; positionClass: 'toast-top-right'; enableHtml: true; };
  formTitle = ''; //Edit

  baseUrl  = environment.ibcs.rpmBackend+'api/fyw-sector-sub-sector-selection/';

  fiscalYearList:any = [];
  sectorTypeList:any = [];
  subSectorTypeList:any = [];
  subSectorTypeListStore:any = [];

  constructor(
      private formBuilder: FormBuilder,
      private _fuseTranslationLoaderService: FuseTranslationLoaderService,
      private api: ApiService,
      private toastr: ToastrService,
      private globalVal: GlobalValidationServiceService,
      private matSnackBar : SnackbarHelper,
      private dialog: MatDialog,
      private dataCom: DataComService,
      private router:Router
      ) {
      
      // Language translations
      this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
  
  }

  ngOnInit(): void {
      this.formTitle = 'Add';
      this.frmGroup = this.formBuilder.group({
      uuid:[''],
      taskTitle :['', [this.globalVal.trimValidator('Task title')]],
      proposalPageNo :['', [this.globalVal.trimValidator('Proposal page no')]],
      researcherNote :['', [this.globalVal.trimValidator('Researcher note')]],
      supervisorOrEvaluatorNote :[''],
      isCompleted :[''],
      isEditable :[''],
  });

  this.api.get(this.baseUrl+'get-active-fiscal-years').subscribe(res => { 
       if(res){
         this.fiscalYearList = res.fiscalYear;
         this.sectorTypeList = res.sectorTypes;
         this.subSectorTypeListStore = res.subSectors;
         this.getEditableData();
       }
    });
  }

  getEditableData(){
  
    this.subscription = this.dataCom.getPassedItemData.subscribe(
      res => {  
        if(res && res.uuid != "")
        {
          this.formTitle = 'Edit';
          res.stSubSectorId = res.stSubSectorId ? JSON.parse(res.stSubSectorId) : '';
          this.frmGroup.patchValue(res);  
          this.changeSector({"value":res.stSectorTypeId});
        }
      },
      err => {
        this.formTitle = 'Add';
      }
    )  
  }


  editRow(data) {          
      this.formTitle = "Edit";
      this.frmGroup.patchValue(data);      
      this.frmGroup.patchValue({active: data.active.toString()});
      this.frmGroup.patchValue({form_type: 'Profession'});
  }


  changeSector(sectorId){
    this.subSectorTypeList = [];
    this.subSectorTypeList = this.subSectorTypeListStore.filter(function (res) {
      if(res.sectorTypeId.id == sectorId.value)
      {
        return res;
      }
    });
  }
  /*------------------------Insert form functions----------------------*/
  onSubmit() {  
    if (this.frmGroup.valid) {
      this.submitForm();
    }
  }

  submitForm() {
    this.spinner = true;
    if (this.frmGroup.value.uuid != "" && this.frmGroup.value.uuid != null) {
      this.frmGroup.value.stSubSectorId = JSON.stringify(this.frmGroup.value.stSubSectorId);
      this.api.update(this.baseUrl + 'edit', this.frmGroup.value).subscribe(
        res => {
          if (res.success > 0) {
            this.spinner = false;
            this.toastr.success(res.message, "", this.config);            
            this.formReset();
            this.back();
          }
          else
          {
            this.spinner = false;
            this.toastr.warning(res.message, "", this.config);
          }         
        },
        err => {
          this.toastr.error('Http Error Occord !.', "", this.config);
        }
      )
    }
    else {      
      this.frmGroup.value.stSubSectorId = JSON.stringify(this.frmGroup.value.stSubSectorId);
      this.api.post(this.baseUrl+'add', this.frmGroup.value).subscribe(
        res => {
          if (res.success > 0) {
            this.spinner = false;
            this.toastr.success(res.message, "", this.config);            
            this.formReset();
            this.back();
          }
          else
          {
            this.spinner = false;
            this.toastr.warning(res.message, "", this.config);
          }        
        },
        err => {
          this.toastr.error('Http Error Occord !.', "", this.config);
        }
      )
    }
  }

  formReset(){    
    this.formTitle = 'Add';
    this.frmGroup.reset();
    this.inputForm.resetForm();
    this.frmGroup.patchValue({ forType: "" });
    this.frmGroup.patchValue({ active: 'true' });
  }  
  back(){
    this.router.navigate(['/sector-sub-sector-list']);
  }
  /*------------------------/Insert form functions----------------------*/

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
