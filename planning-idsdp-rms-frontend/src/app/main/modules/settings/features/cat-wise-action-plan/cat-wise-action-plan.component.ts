import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, NgForm} from '@angular/forms';
import {PageEvent} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
//----Lng Translation----
import { FuseTranslationLoaderService } from 'app/main/core/services/translation-loader.service';
import {locale as lngEnglish} from './i18n/en';
import {locale as lngBangla} from './i18n/bn';
import { ApiService } from 'app/main/core/services/api/api.service';
import { ToastrService } from 'ngx-toastr';
import { GlobalValidationServiceService } from 'app/main/core/services/global-validation-service.service';
import { ProfessionTbl } from '../../models/ProfessionTbl';
import { DEFAULT_SIZE } from 'app/main/core/constants/constant';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmDialogConstant } from 'app/main/shared/constant/confirm.dialog.constant';
import { SnackbarHelper } from 'app/main/core/helper/snackbar.helper';
import { SubmitConfirmationDialogComponent } from 'app/main/shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component';

import { FiscalYearServiceService } from '../../services/fiscal-year-service.service';
import { RESEARCH_CATEGORIES } from 'app/main/core/constants/researchCategories.constants';
import { CatWiseActionPlanService } from '../../services/cat-wise-action-plan.service';

@Component({
  selector: 'app-cat-wise-action-plan',
  templateUrl: './cat-wise-action-plan.component.html',
  styleUrls: ['./cat-wise-action-plan.component.scss']
})
export class CatWiseActionPlanComponent implements OnInit {

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
  displayedColumns: string[] = ['position','fiscalYear','researchCategoryType','taskName','totalDays','action'];
  dataSource: any;
  fiscalYearListFull: any[] = [];
  fiscalYearList: any[] = [];
  @ViewChild('inputForm') inputForm: NgForm;
  researchCategoryList = RESEARCH_CATEGORIES

  constructor(
      private formBuilder: FormBuilder,
      private _fuseTranslationLoaderService: FuseTranslationLoaderService,
      private api: ApiService, 
      private fiscalyearservice: FiscalYearServiceService,
      private toastr: ToastrService,
      private globalVal: GlobalValidationServiceService,
      private matSnackBar : SnackbarHelper,
      private dialog: MatDialog,
      private catWiseActionPlanService:CatWiseActionPlanService
      ) {
      // Language translations
      this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
  }

  ngOnInit(): void {
    this.formTitle = 'Add';
    this.frmGroup = this.formBuilder.group({
      id: [],
      uuid: [''],      
      stFiscalYearId:['',this.globalVal.trimValidator('Fiscal year')],
      stResearchCategoryTypeId:['',this.globalVal.trimValidator('Research category')],
      taskName:['',this.globalVal.trimValidator('Plan name')],
      totalDays:['',this.globalVal.trimValidator('Total days')],
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
    this.catWiseActionPlanService.getListData(this.page, this.pageSize).subscribe(res => {

      var sourceData:any = [];
      res.response.content.forEach(e => {
        var val:any = e;

       this.fiscalYearListFull.forEach(v => {
         if(v.id == e.stFiscalYearId)
         {
          val.fiscalYear = v.fiscalYear;
         }
       })

       this.researchCategoryList.forEach( v => {
        if(v.id == e.stResearchCategoryTypeId)
        {
           val.researchCategoryType = v.category_name;
        }
       });

        sourceData.push(val);
      });
      this.dataSource = new MatTableDataSource(res.response ? sourceData : []);
      this.totalElements = res.response ? res.response.totalElements : 0;
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
    this.catWiseActionPlanService.delete(rowUuid).subscribe(res => {
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
    // if (this.formTitle == 'Edit') {
    //   this.catWiseActionPlanService.updateData(this.frmGroup.value).subscribe(
    //     res => {
    //       if (res.success) {
    //         this.spinner=false;
    //         this.toastr.success(res.message, "Success!", this.config);
    //         this.formReset();
    //         this.getListData();
    //       } else {
    //         this.spinner=false;
    //         this.toastr.error(res.message, "Error!", this.config);
    //       }
    //     },
    //     err => {
    //       console.log('err==== > ', err);
    //       this.toastr.error('Http Error Occord !.', "Error!", this.config);
    //     }
    //   )
    // }
    // else {
      this.catWiseActionPlanService.saveData(this.frmGroup.value).subscribe(
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
    //}
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
