import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, NgForm } from '@angular/forms';
//----Lng Translation----
import { DateAdapter } from '@angular/material/core';
import { Router } from '@angular/router';
import { MIN_EDITOR_CONFIG } from 'app/main/core/constants/editor-config';
import { ApiService } from 'app/main/core/services/api/api.service';
import { DataComService } from 'app/main/core/services/data-com/data-com.service';
import { GlobalValidationServiceService } from 'app/main/core/services/global-validation-service.service';
import { FuseTranslationLoaderService } from 'app/main/core/services/translation-loader.service';
import { ResearchCategoryTypeService } from 'app/main/modules/settings/services/research-category-type.service';
import { environment } from 'environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import {
  deleteIcon,
  editIcon,
  previousIcon,
  refreshIcon,
  saveIcon,
} from '../../../../constants/button.constants';
import { locale as lngBangla } from '../i18n/bn';
import { locale as lngEnglish } from '../i18n/en';
@Component({
  selector: 'app-create-add',
  templateUrl: './create-add.component.html',
  styleUrls: ['./create-add.component.scss'],
})
export class CreateAddComponent implements OnInit {
  /*----Button---*/
  refreshIcon = refreshIcon;
  saveIcon = saveIcon;
  previousIcon = previousIcon;
  editIcon = editIcon;
  deleteIcon = deleteIcon;
  /*----/Button---*/
  @ViewChild('inputForm') inputForm: NgForm;
  @ViewChild('ckeditorf') ckeditorf: any;
  subscription: Subscription;
  formTypes: any = [];
  spinner: boolean = false;
  frmGroup: FormGroup;
  config: { timeOut: 5000; closeButton: true; positionClass: 'toast-top-right'; enableHtml: true; };
  formTitle = '';
  updateRowIndex = 0;
  storeData = '';
  baseUrl = environment.ibcs.rpmBackend + 'api/fyw-sector-sub-sector/';
  letterList = []; 
  fiscalYear = localStorage.getItem('fiscalYear');
  rows: FormArray;
  /*
   * Added By Rakibul
   * */
  fiscalYearId: any;
  /*end*/
  researchCategoryList = [];
  mediumEditorConfig: any = MIN_EDITOR_CONFIG;
  langVal:string;
  constructor(
    private dateAdapter: DateAdapter<Date>,
    private formBuilder: FormBuilder,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    private api: ApiService,
    private toastr: ToastrService,
    private globalVal: GlobalValidationServiceService,
    private dataCom: DataComService,
    private router: Router,
    private _researchCategoryTypeService: ResearchCategoryTypeService
  ) {
    // Language translations
    this._fuseTranslationLoaderService.loadTranslations(
      lngEnglish,
      lngBangla
    );
    this.langVal = localStorage.getItem("currentLang")
      this.dataCom.getPassedItemData.subscribe(res => {
          if (res?.lang) {
              this.langVal = res?.lang ? res?.lang : '';
          }
      });

    this.dateAdapter.setLocale('en-GB'); //dd/MM/yyyy
    this._researchCategoryTypeService.getAllActiveList().subscribe((response) => {
        this.researchCategoryList = response.items
          ? response.items
          : [];
      });
  }
  ngOnInit(): void {
    this.formTitle = 'Add';
    this.subscription = this.dataCom.getPassedItemData.subscribe((res) => {
      this.fiscalYearId = +res[0]['fiscslYearId'];
      if (res?.length > 0) {
        this.storeData = res;
        this.letterList = [];
        this.api.get(this.baseUrl +'get-request-letters/' +res[0]['fiscslYearId']).subscribe((res) => {
            if (res.success) {
              this.letterList = res.items;
            }
        });

          this.frmGroup = this.formBuilder.group({
            uuid:[''],
            stFiscalYearId :[res[0]['fiscslYearId']],

            letterFor :['', [this.globalVal.trimValidator('Letter For')]],
            memorandumNo :[''],
            advertisementStartDate :['', [this.globalVal.trimValidator('Advertisement Start Date')]],
            advertisementEndDate :['', [this.globalVal.trimValidator('Advertisement End Date')]],
            paragraph1 :['', [this.globalVal.trimValidator('Paragraph one')]],
            paragraph2 :['', [this.globalVal.trimValidator('Paragraph two')]],
            nitimalaUrl :[''],
            nitimalaYear :[''],
            uploadFile :[''],
            isEditable :[false],
            isActive :[true],

            phdCatId : [4],
            phdCatBudgetAmount : ['',
              [
                this.globalVal.trimValidator('Budget amount'),
                this.globalVal.NameSpecialChar('Budget amount'),
              ]
            ],
            mphilCatId : [5],
            mphilCatBudgetAmount : ['',
              [
                this.globalVal.trimValidator('Budget amount'),
                this.globalVal.checkSpecialChar('Budget amount'),
              ]
            ],
            fellowCatId : [2],
            fellowCatBudgetAmount : ['', [this.globalVal.trimValidator('Budget amount')]],
            promoCatId : [6],
            promoCatBudgetAmount : ['', [this.globalVal.trimValidator('Budget amount')]],
            instCatId : [1],
            instCatBudgetAmount : ['', [this.globalVal.trimValidator('Budget amount')]],

            tiApplicationStartDate : ['', [this.globalVal.trimValidator('Application start date')]],
            tiApplicationEndDate : ['', [this.globalVal.trimValidator('Application end date')]],
            tiBudgetAmount : ['', [this.globalVal.trimValidator('Budget amount')]],
        });
        }
        else{
          this.router.navigate(['/sector-sub-sector-list']);
        }
      }
    )

  }

  typeOf(value) {
    return typeof value;
  }

  editLetter(data, index) {
    this.updateRowIndex = index;
    this.formTitle = 'Edit';
    this.frmGroup.patchValue(data);
    this.frmGroup.patchValue({ isEditable: data.isEditable.toString() });
  }
  /*------------------------Insert form functions----------------------*/
  onSubmit() {
    if (this.frmGroup.valid) {
      this.submitForm();
    } else {
      console.log('dddddddd', this.frmGroup);
    }
  }
  submitForm() {
    this.spinner = true;
    if (this.formTitle == 'Edit') {
      this.api
        .update(this.baseUrl + 'edit', this.frmGroup.value)
        .subscribe(
          (res) => {
            if (res.success > 0) {
              this.spinner = false;
              this.toastr.success(res.message, '', this.config);
              this.letterList.splice(this.updateRowIndex, 1, {
                ...res.obj,
              });
              this.formReset();
              this.viewDetails(res.obj);
            } else {
              this.spinner = false;
              this.toastr.warning(res.message, '', this.config);
            }
          },
          (err) => {
            this.toastr.error(
              'Http Error Occord !',
              '',
              this.config
            );
          }
        );
    } else {
      this.api.post(this.baseUrl + 'add', this.frmGroup.value).subscribe(
        (res) => {
          if (res.success > 0) {
            this.spinner = false;
            this.toastr.success(res.message, '', this.config);
            this.letterList.push(res.obj);
            this.formReset();
            this.viewDetails(res.obj);
          } else {
            this.spinner = false;
            this.toastr.warning(res.message, '', this.config);
          }
        },
        (err) => {
          this.toastr.error('Http Error Occurred !', '', this.config);
        }
      );
    }
  }
  formReset() {
    this.formTitle = 'Add';
    this.frmGroup.reset();
    this.inputForm.resetForm();
    this.ckeditorf.instance.setData('');
    this.frmGroup.patchValue({ forType: '' });
  }
  /*------------------------/Insert form functions----------------------*/
  // ngOnDestroy(): void {
  //   this.subscription.unsubscribe();
  // }
  viewDetails(data) {
    console.log('this.storeData= ', this.storeData);
    data['storeData'] = JSON.stringify(this.storeData);
    sessionStorage.setItem('letterInfo', JSON.stringify(data));
    this.router.navigate(['/request-letter-detail/' + this.fiscalYearId]);
  }
  previous() {
    this.router.navigate(['/sector-sub-sector-details']);
  }
}
