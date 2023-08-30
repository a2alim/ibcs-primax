import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {PageEvent} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
import {TranslateService} from '@ngx-translate/core';
//----Lng Translation----
import { FuseTranslationLoaderService } from 'app/main/core/services/translation-loader.service';
import {locale as lngEnglish} from './i18n/en';
import {locale as lngBangla} from './i18n/bn';
import { ApiService } from 'app/main/core/services/api/api.service';
import { ToastrService } from 'ngx-toastr';
import { GlobalValidationServiceService } from 'app/main/core/services/global-validation-service.service';
import { ProfessionTbl } from '../../models/ProfessionTbl';
import { DEFAULT_PAGE, DEFAULT_SIZE } from 'app/main/core/constants/constant';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmDialogConstant } from 'app/main/shared/constant/confirm.dialog.constant';
import { SnackbarHelper } from 'app/main/core/helper/snackbar.helper';
import { SubmitConfirmationDialogComponent } from 'app/main/shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component';
import { PredefinedTemplateServiceService } from '../../services/predefined-template-service.service';
import { TemplateTypeServiceService } from '../../services/template-type-service.service';
import { HelperServiceService } from 'app/main/core/services/helper-service.service';
import {MIN_EDITOR_CONFIG} from "../../../../core/constants/editor-config";

@Component({
  selector: 'app-predefined-template',
  templateUrl: './predefined-template.component.html',
  styleUrls: ['./predefined-template.component.scss']
})
export class PredefinedTemplateComponent implements OnInit {
  spinner:Boolean=false;
  frmGroup: FormGroup;
  config: { timeOut: 5000; closeButton: true; positionClass: 'toast-top-right'; enableHtml: true; };
  formTitle = ''; //Edit

  dataSet: ProfessionTbl[] = new Array<ProfessionTbl>();
  headerTitle: string = 'Test Comp';
  headerSubTitle: string = 'Home > Test Component';

  page:number = 0;
  totalElements: number = DEFAULT_SIZE;
  pageSize: number = DEFAULT_SIZE;

  //TODO: This is number of column for Mat Table
  //displayedColumns: string[] = ['position', 'templateType','subject','header','footer', 'demo','demo1','active', 'action'];
  displayedColumns: string[] = ['position', 'templateType','subject','active', 'action'];
  dataSource: any;
  templateTypeList: any[] = [];
  templateTypeListFull: any[] = [];
  @ViewChild('inputForm') inputForm: NgForm;
  @ViewChild("ckeditor") ckeditor: any;
  @ViewChild("ckeditorf") ckeditorf: any;

  isdisable:Boolean=true;

  mediumEditorConfig: any = MIN_EDITOR_CONFIG;

  constructor(
      private formBuilder: FormBuilder,
      private _fuseTranslationLoaderService: FuseTranslationLoaderService,
      private api: ApiService,
      private toastr: ToastrService,
      private globalVal: GlobalValidationServiceService,
      private matSnackBar : SnackbarHelper,
      private helperService:HelperServiceService,
      private dialog: MatDialog,
      private predefinedtemplate:PredefinedTemplateServiceService,
      private templateTypeService:TemplateTypeServiceService
      ) {

      // Language translations
      this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);

      //TODO: This Dataset will be come from database though service
  }

  ngOnInit(): void {
    this.formTitle = 'Add';
    this.frmGroup = this.formBuilder.group({
      id:[],
      uuid:[''],
      active: ['true', Validators.required],
      templateTypeId:['',this.globalVal.trimValidator('Template type')],
      subject :['',this.globalVal.trimValidator('Subject')],
      header :['',this.globalVal.trimValidator('Header')],
      footer :[''],
  });

  this.getTemplateTypeList();
  this.getTemplateTypeListFull();

  }

  //Pagination Page Change onChangeClick
  onChangePage(event: PageEvent) {
    this.pageSize = +event.pageSize; // get the pageSize
    this.page = +event.pageIndex; // get the current page
    this.getListData();
  }


  getListData() {

    this.predefinedtemplate.getListData(this.page, this.pageSize).subscribe(res => {
      var sourceData:any = [];
      res.page.content.forEach(e => {
        var val:any = e;

       this.templateTypeListFull.forEach(v => {
         if(v.id == e.templateTypeId)
         {
          val.templateType = v.templateType;
         }
       })
        sourceData.push(val);
      });

      this.dataSource = new MatTableDataSource(res.page ? sourceData : []);
      this.totalElements = res.page ? res.page.totalElements : 0;
    });

  }




  /*---- For open popup dialog box----*/
  private openDialog(rowUuid) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = false;
      dialogConfig.autoFocus = false;
      dialogConfig.width = ConfirmDialogConstant.WIDTH;
      dialogConfig.height = ConfirmDialogConstant.HEIGHT;
      dialogConfig.panelClass = ConfirmDialogConstant.PANEL_CLASS;
      dialogConfig.data = {message: ConfirmDialogConstant.MESSAGE};
      const dialogRef = this.dialog.open(SubmitConfirmationDialogComponent, dialogConfig);

      dialogRef.componentInstance.closeEventEmitter.subscribe(res => {
          if (res) {
              this.delete(rowUuid);
          }
          dialogRef.close(true);
      });
  }

  delete(rowUuid) {
    this.predefinedtemplate.delete(rowUuid).subscribe(res => {
      if (res.success) {
        this.toastr.success(res.message, "Success!", this.config);
        this.getListData();
      }
      else {
        this.toastr.error(res.message, "Error!", this.config);
      }
    });
  }


  editRow(data) {

   if(this.helperService.isEditable(data.templateTypeId,this.templateTypeList)){

      this.formTitle = "Edit";
      this.frmGroup.patchValue(data);
      this.frmGroup.patchValue({active: data.active.toString()});
   }
  }

  // search data by filter
  applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();

      if (this.dataSource.paginator) {
          this.dataSource.paginator.firstPage();
      }
  }

  /*------------------------Insert form functions----------------------*/
  onSubmit() {
    if (this.frmGroup.valid) {
      this.submitForm();
    }
  }


  submitForm() {
    this.spinner=true;
    if (this.formTitle == 'Edit') {
      this.predefinedtemplate.updateData(this.frmGroup.value).subscribe(
        res => {
          if (res.success) {
            this.spinner=false;
            this.toastr.success(res.message, "Success!", this.config);
            this.formReset();
            this.getListData();
          } else {
            this.spinner=false;
            //this.frmGroup.controls["profession_name"].setErrors({ "customError": true });
            this.toastr.error(res.message, "Error!", this.config);
          }
        },
        err => {
          this.spinner=false;
          this.toastr.error('Http Error Occord !.', "Error!", this.config);
        }
      )
    }
    else {
      this.predefinedtemplate.saveData(this.frmGroup.value).subscribe(
        res => {
          if (res.success) {
            this.spinner=false;
            this.toastr.success(res.message, "Success!", this.config);
            this.formReset();
            this.getListData();
          } else {
            this.spinner=false;
            this.toastr.error(res.message, "Error!", this.config);
          }
        },
        err => {
          console.log('err==== > ', err);
          this.spinner=false;
          this.toastr.error('Http Error Occord !.', "Error!", this.config);
        }
      )
    }
  }

  getTemplateTypeList() {
    this.templateTypeService.getAllActive().subscribe(
      res => {
        this.templateTypeList = res.items ? res.items : [];
      }
    );
  }

  getTemplateTypeListFull() {
    this.templateTypeService.getAll().subscribe(
      res => {
        this.templateTypeListFull = res.items ? res.items : [];
        this.getListData();
      }
    );
  }


  formReset(){
    this.formTitle = 'Add';
    this.ckeditor.instance.setData('');
    this.ckeditorf.instance.setData('');
    this.frmGroup.reset();
    this.inputForm.resetForm();
    this.frmGroup.patchValue({ active: 'true' });
  }
  /*------------------------/Insert form functions----------------------*/

  t(value:any){
   //console.log(value)
  }
}

