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

import { FiscalYearWiseBudgetServiceService } from '../../services/fiscal-year-wise-budget-service.service';
import { FiscalYearServiceService } from '../../services/fiscal-year-service.service';

@Component({
  selector: 'app-fiscal-year-wise-budget',
  templateUrl: './fiscal-year-wise-budget.component.html',
  styleUrls: ['./fiscal-year-wise-budget.component.scss']
})

export class FiscalYearWiseBudgetComponent implements OnInit {
  spinner:boolean = false;
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
  displayedColumns: string[] = ['position', 'fiscalYear', 'revisionNo','totalAllocatedBudgetAmount','active', 'action'];
  dataSource: any;
  fiscalYearListFull: any[] = [];
  fiscalYearList: any[] = [];
  @ViewChild('inputForm') inputForm: NgForm;



  constructor(
      private formBuilder: FormBuilder,
      private _fuseTranslationLoaderService: FuseTranslationLoaderService,
      private api: ApiService,
      private fiscalYearBudget:FiscalYearWiseBudgetServiceService,
      private fiscalyearservice: FiscalYearServiceService,
      private toastr: ToastrService,
      private globalVal: GlobalValidationServiceService,
      private matSnackBar : SnackbarHelper,
      private dialog: MatDialog) {
      // Language translations
      this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
  }

  ngOnInit(): void {
    this.formTitle = 'Add';
    this.frmGroup = this.formBuilder.group({
      id: [],
      uuid: [''],
      fiscalYearId:['',this.globalVal.trimValidator('Fiscal year Id')],
      revisionNo:[],
      totalAllocatedBudgetAmount:['',this.globalVal.trimValidator('Budget amount')],
      active: ['true', Validators.required],

  });
  this.getFiscalyearList();
  this.getFiscalyearListFull();

  this.getListData();
  }

  //Pagination Page Change onChangeClick
  onChangePage(event: PageEvent) {
    this.pageSize = +event.pageSize; // get the pageSize
    this.page = +event.pageIndex; // get the current page
    this.getListData();
  }


  getListData() {
    this.fiscalYearBudget.getListData(this.page, this.pageSize).subscribe(res => {

      var sourceData:any = [];
      res.page.content.forEach(e => {
        var val:any = e;

       this.fiscalYearListFull.forEach(v => {
         if(v.id == e.fiscalYearId)
         {
          val.fiscalYear = v.fiscalYear;
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
    this.fiscalYearBudget.delete(rowUuid).subscribe(res => {
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
      this.formTitle = "Edit";
      this.frmGroup.patchValue(data);
      this.frmGroup.patchValue({active: data.active.toString()});
      console.log('Edit Data By ' + JSON.stringify(data))
  }

  // search data by filter
  applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      console.log(filterValue)
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
      this.fiscalYearBudget.updateData(this.frmGroup.value).subscribe(
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
          console.log('err==== > ', err);
          this.toastr.error('Http Error Occord !.', "Error!", this.config);
        }
      )
    }
    else {
      this.fiscalYearBudget.saveData(this.frmGroup.value).subscribe(
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
          this.toastr.error('Http Error Occord !.', "Error!", this.config);
        }
      )
    }
  }

  getFiscalyearList() {
    this.fiscalyearservice.getAllActive().subscribe(
      res => {
        this.fiscalYearList = res.items ? res.items : [];
      }
    );
  }

  getFiscalyearListFull() {
    this.fiscalyearservice.getAll().subscribe(
      res => {
        this.fiscalYearListFull = res.items ? res.items : [];
      }
    );
  }
  formReset(){
    this.formTitle = 'Add';

    this.frmGroup.reset();
    this.inputForm.resetForm();
    this.frmGroup.patchValue({ active: 'true' });
  }



  /*------------------------/Insert form functions----------------------*/
}
