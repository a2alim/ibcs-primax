import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { PageEvent } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { TranslateService } from '@ngx-translate/core';
//----Lng Translation----
import { FuseTranslationLoaderService } from 'app/main/core/services/translation-loader.service';
import { locale as lngEnglish } from './i18n/en';
import { locale as lngBangla } from './i18n/bn';
import { ApiService } from 'app/main/core/services/api/api.service';
import { ToastrService } from 'ngx-toastr';
import { GlobalValidationServiceService } from 'app/main/core/services/global-validation-service.service';
import { ProfessionTbl } from '../../models/ProfessionTbl';
import { DEFAULT_PAGE, DEFAULT_SIZE } from 'app/main/core/constants/constant';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmDialogConstant } from 'app/main/shared/constant/confirm.dialog.constant';
import { SnackbarHelper } from 'app/main/core/helper/snackbar.helper';
import { SubmitConfirmationDialogComponent } from 'app/main/shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component';
import { ResearchCategoryTypeService } from "../../services/research-category-type.service";
import { refreshBtn, saveBtn, editBtn, deleteBtn } from '../../constants/button.constants';

@Component({
  selector: 'app-research-category-type',
  templateUrl: './research-category-type.component.html',
  styleUrls: ['./research-category-type.component.scss']
})
export class ResearchCategoryTypeComponent implements OnInit {
  /*----Button---*/
  refreshBtn = refreshBtn; saveBtn = saveBtn; editBtn = editBtn; deleteBtn = deleteBtn;
  /*----/Button---*/

  frmGroup: FormGroup;
  config: { timeOut: 5000; closeButton: true; positionClass: 'toast-top-right'; enableHtml: true; };
  formTitle = '';

  dataSet: ProfessionTbl[] = new Array<ProfessionTbl>();
  headerTitle: string = 'Research Category';
  headerSubTitle: string = 'Home > Research Category';

  page: number = 0;
  totalElements: number = DEFAULT_SIZE;
  pageSize: number = DEFAULT_SIZE;

  //TODO: This is number of column for Mat Table
  displayedColumns: string[] = ['position', 'categoryName', 'active', 'action'];
  dataSource: any;
  spinner: boolean;
  @ViewChild('inputForm') inputForm: NgForm;

  constructor(
    private formBuilder: FormBuilder,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    private _researchCategoryTypeService: ResearchCategoryTypeService,
    private toastr: ToastrService,
    private globalVal: GlobalValidationServiceService,
    private matSnackBar: SnackbarHelper,
    private dialog: MatDialog
  ) {
    // Language translations
    this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    this.totalElements = this.dataSet.length;
  }

  ngOnInit(): void {
    this.formTitle = 'Add';
    this.frmGroup = this.formBuilder.group({
      id: [],
      uuid: [''],
      categoryName: ['', this.globalVal.trimValidator('Category name')],
      active: ['true', Validators.required],
    });
    this.getListData();
  }

  //Pagination Page Change onChangeClick
  onChangePage(event: PageEvent) {
    this.pageSize = +event.pageSize; // get the pageSize
    this.page = +event.pageIndex; // get the current page
    this.getListData();
  }

  getListData() {
    this.spinner = true;
    this._researchCategoryTypeService.getListData(this.page, this.pageSize).subscribe(res => {
      this.dataSource = new MatTableDataSource(res.page ? res.page.content : []);
      this.totalElements = res.page ? res.page.totalElements : 0;
      this.spinner = false;
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
    dialogConfig.data = { message: ConfirmDialogConstant.MESSAGE };
    const dialogRef = this.dialog.open(SubmitConfirmationDialogComponent, dialogConfig);

    dialogRef.componentInstance.closeEventEmitter.subscribe(res => {
      if (res) {
        this.delete(rowUuid);
      }
      dialogRef.close(true);
    });
  }

  delete(rowUuid) {
    this.spinner = true;
    this._researchCategoryTypeService.delete(rowUuid).subscribe((res: any) => {
      if (res.success) {
        this.spinner = false;
        this.toastr.success(res.message, "Success!", this.config);
        this.getListData();
      }
      else {
        this.spinner = false;
        this.toastr.error(res.message, "Error!", this.config);
      }
    });
  }

  editRow(data) {
    this.formTitle = "Edit";
    this.frmGroup.patchValue(data);
    this.frmGroup.patchValue({ active: data.active.toString() });
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
    this.spinner = true;

    if (this.formTitle == 'Edit') {
      this._researchCategoryTypeService.updateData(this.frmGroup.value).subscribe(
        res => {
          if (res.success) {
            this.spinner = false;
            this.toastr.success(res.message, "Success!", this.config);
            this.formReset();
            this.getListData();
          } else {
            //this.frmGroup.controls["profession_name"].setErrors({ "customError": true });
            this.toastr.error(res.message, "Error!", this.config);
            this.spinner = false;
          }
        },
        err => {
          console.log('err==== > ', err);
          this.toastr.error('Http Error Occord !.', "Error!", this.config);
          this.spinner = false;
        }
      )
    }
    else {
      this._researchCategoryTypeService.saveData(this.frmGroup.value).subscribe(
        res => {
          if (res.success) {
            this.spinner = false;
            this.toastr.success(res.message, "Success!", this.config);
            this.formReset();
            this.getListData();
          } else {
            this.spinner = false;
            this.toastr.error(res.message, "Error!", this.config);
          }
        },
        err => {
          this.spinner = false;
          console.log('err==== > ', err);
          this.toastr.error('Http Error Occord !.', "Error!", this.config);
        }
      )
    }
  }

  formReset() {
    this.formTitle = 'Add';
    this.frmGroup.reset();
    this.inputForm.resetForm();
    this.frmGroup.patchValue({ active: 'true' });
  }
  /*------------------------/Insert form functions----------------------*/

}
