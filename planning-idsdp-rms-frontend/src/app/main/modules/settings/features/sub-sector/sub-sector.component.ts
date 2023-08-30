import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { PageEvent } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { TranslateService } from '@ngx-translate/core';
//----Lng Translation----
import { FuseTranslationLoaderService } from 'app/main/core/services/translation-loader.service';
import { ApiService } from 'app/main/core/services/api/api.service';
import { ToastrService } from 'ngx-toastr';
import { GlobalValidationServiceService } from 'app/main/core/services/global-validation-service.service';
import { ProfessionTbl } from '../../models/ProfessionTbl';
import { DEFAULT_PAGE, DEFAULT_SIZE } from 'app/main/core/constants/constant';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmDialogConstant } from 'app/main/shared/constant/confirm.dialog.constant';
import { SnackbarHelper } from 'app/main/core/helper/snackbar.helper';
import { SubmitConfirmationDialogComponent } from 'app/main/shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component';
import { ResearchCategoryTypeService } from '../../services/research-category-type.service';
import { CategoryWiseDeskOfficerService } from '../../services/category-wise-desk-officer.service';
import { locale as lngEnglish } from './i18n/en';
import { locale as lngBangla } from './i18n/bn';
import { SectorTypeService } from '../../services/sector-type.service';
import { SubSectorService } from '../../services/sub-sector.service';

@Component({
  selector: 'app-sub-sector',
  templateUrl: './sub-sector.component.html',
  styleUrls: ['./sub-sector.component.scss']
})
export class SubSectorComponent implements OnInit {
  frmGroup: FormGroup;
  config: { timeOut: 5000; closeButton: true; positionClass: 'toast-top-right'; enableHtml: true; };
  formTitle = '';

  dataSet: any[] = new Array<any>();
  headerTitle: string = 'Sub Field';
  headerSubTitle: string = 'Home > Sub Field';

  page: number = 0;
  totalElements: number = DEFAULT_SIZE;
  pageSize: number = DEFAULT_SIZE;

  //TODO: This is number of column for Mat Table
  displayedColumns: string[] = ['position', 'sectorType', 'subFieldName', 'active', 'action'];
  dataSource: any;
  sectorTypeList: any[] = [];
  spinner: boolean;
  @ViewChild('inputForm') inputForm: NgForm;

  constructor(
    private formBuilder: FormBuilder,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    private _researchCategoryTypeService: ResearchCategoryTypeService,
    private _categoryWiseDeskOfficerService: CategoryWiseDeskOfficerService,
    private _sectorTypeService: SectorTypeService,
    private _subSectorService: SubSectorService,
    private api: ApiService,
    private toastr: ToastrService,
    private globalVal: GlobalValidationServiceService,
    private matSnackBar: SnackbarHelper,
    private dialog: MatDialog
  ) {

    // Language translations
    this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    this.totalElements = this.dataSet.length;
    this.dataSource = new MatTableDataSource(this.dataSet);
  }

  ngOnInit(): void {
    this.formTitle = 'Add';
    this.populateForm();
    this.getListData();
    this.getSectorTypeList();
  }

  // For initializing form
  private populateForm() {
    this.frmGroup = this.formBuilder.group({
        id:[],
      uuid: [''],
      subFieldName: ['', this.globalVal.trimValidator('Sub field name')],
      sectorTypeId: ['', Validators.required],
      active: ['true', Validators.required]
    });
  }

  //Pagination Page Change onChangeClick
  onChangePage(event: PageEvent) {
    this.pageSize = +event.pageSize; // get the pageSize
    this.page = +event.pageIndex; // get the current page
    this.getListData();
  }sectorType

  getListData() {
    this.spinner = true;
    this._subSectorService.getListData(this.page, this.pageSize).subscribe(res => {
        var dataVal:any = [];
        res.page.content.forEach(e => {
            var val:any = e;
            val.sectorType = e.sectorTypeId.fieldName;
            dataVal.push(val);
        });
        this.dataSource = new MatTableDataSource(res.page ? res.page.content : []);
      this.totalElements = res.page ? res.page.totalElements : 0;
      this.spinner = false;
    })
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
    this._subSectorService.delete(rowUuid).subscribe(res => {
      if (res) {
        this.spinner = false;
        this.toastr.success('Delete Successful.', "Success!", this.config);
        this.getListData();
      }
      else {
        this.toastr.error('Delete Faild!.', "Error!", this.config);
        this.spinner = false;
      }
    });
  }

  editRow(data) {
    this.formTitle = "Edit";
    this.frmGroup.patchValue({
        id:data.id,
      uuid: data.uuid,
      subFieldName: data.subFieldName,
      sectorTypeId: data.sectorTypeId,
      active: data.active.toString(),
    });
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
      this._subSectorService.updateData(this.frmGroup.value).subscribe(
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
    else {
      this._subSectorService.saveData(this.frmGroup.value).subscribe(
        res => {
          if (res.success) {
            this.getListData();
            this.spinner = false;
            this.formReset();
            this.toastr.success(res.message, "Success!", this.config);
          } else {
            this.spinner = false;
            this.toastr.error(res.message, "Error!", this.config);
          }
        },
        err => {
          this.spinner = false;
          console.log('err==== > ', err);
          this.toastr.error('Http Error Occurred !.', "Error!", this.config);
        }
      )
    }
    this.formReset();
  }

  formReset(){
    this.formTitle = 'Add';
    this.frmGroup.reset();
    this.inputForm.resetForm();
    this.frmGroup.patchValue({ active: 'true' });
  }

  /*------------------------/Insert form functions----------------------*/
  getSectorTypeList() {
    this.spinner = true;
    this._sectorTypeService.getAllActiveList().subscribe(
      res => {
        this.spinner = false;
        this.sectorTypeList = res.items ? res.items : [];
      }
    );
  }

  compareFn(x: any, y: any): boolean {
    return x && y ? x.id === y.id : x === y;
  }
}
