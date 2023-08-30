import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { PageEvent } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { TranslateService } from '@ngx-translate/core';

import { ApiService } from 'app/main/core/services/api/api.service';
import { ToastrService } from 'ngx-toastr';
import { GlobalValidationServiceService } from 'app/main/core/services/global-validation-service.service';
import { DEFAULT_PAGE, DEFAULT_SIZE } from 'app/main/core/constants/constant';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmDialogConstant } from 'app/main/shared/constant/confirm.dialog.constant';
import { SnackbarHelper } from 'app/main/core/helper/snackbar.helper';
import { SubmitConfirmationDialogComponent } from 'app/main/shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component';
import { ResearchCategoryTypeService } from '../../services/research-category-type.service';
import { CategoryWiseDeskOfficerService } from '../../services/category-wise-desk-officer.service';
//----Lng Translation----
import { FuseTranslationLoaderService } from 'app/main/core/services/translation-loader.service';
import { locale as lngEnglish } from './i18n/en';
import { locale as lngBangla } from './i18n/bn';
import { UserListServiceService } from '../../services/user-list-service.service';


@Component({
  selector: 'app-category-wise-desk-officer',
  templateUrl: './category-wise-desk-officer.component.html',
  styleUrls: ['./category-wise-desk-officer.component.scss']
})
export class CategoryWiseDeskOfficerComponent implements OnInit {
  frmGroup: FormGroup;
  config: { timeOut: 5000; closeButton: true; positionClass: 'toast-top-right'; enableHtml: true; };
  formTitle = ''; //Edit

  dataSet: any[] = new Array<any>();
  headerTitle: string = 'Category Wise Desk Officer';
  headerSubTitle: string = 'Home > Category Wise Desk Officer';

  page: number = 0;
  totalElements: number = DEFAULT_SIZE;
  pageSize: number = DEFAULT_SIZE;

  //TODO: This is number of column for Mat Table
  displayedColumns: string[] = ['position', 'fiscalYear', 'categoryName', 'catWiseProfileMark', 'catWiseProposalMark','user', 'active', 'action'];
  dataSource: any;
  researchCategoryTypeList: any[] = [];
  fiscalYearList: any[] = [];
  userList : any []=[];

  spinner: boolean;
  @ViewChild('inputForm') inputForm: NgForm;

  constructor(
    private formBuilder: FormBuilder,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    private _researchCategoryTypeService: ResearchCategoryTypeService,
    private _categoryWiseDeskOfficerService: CategoryWiseDeskOfficerService,
    private api: ApiService,
    private toastr: ToastrService,
    private globalVal: GlobalValidationServiceService,
    private matSnackBar: SnackbarHelper,
    private dialog: MatDialog,
    private userListService: UserListServiceService,
  ) {

    // Language translations
    this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);

    this.totalElements = this.dataSet.length;
   // this.dataSource = new MatTableDataSource(this.dataSet);
  }

  ngOnInit(): void {    
    this.formTitle = 'Add';
    this.populateForm();
    this.getListData();
    this.getResearchCategoryTypeList();
    this.getFiscalYearList();
    this.getUserList();
  }

  // For initializing form
  private populateForm() {
    this.frmGroup = this.formBuilder.group({
      uuid: [''],
      stFiscalYearId: ['', Validators.required],
      stResearchCategoryTypeId: ['', Validators.required],
      catWiseProfileMark: [0, this.globalVal.graterThan50('Profile mark')],
      catWiseProposalMark: [0, this.globalVal.graterThan50('Proposal mark')],
      active: ['true', Validators.required],
      userId: ['', Validators.required]
    });
  }

  //Pagination Page Change onChangeClick
  onChangePage(event: PageEvent) {
    this.pageSize = +event.pageSize; // get the pageSize
    this.page = +event.pageIndex; // get the current page
    this.getListData();
  }

  getListData() {
    this.spinner = true;
    this._categoryWiseDeskOfficerService.getListData(this.page, this.pageSize).subscribe(res => {
      
      var dataVal:any = [];
      res.page.content.forEach(e => { 
        var val:any = e;
        val.fiscalYear = e.stFiscalYearId.fiscalYear;
        val.categoryName = e.stResearchCategoryTypeId.categoryName;
        dataVal.push(val);        
      });  

      this.dataSource = new MatTableDataSource(res.page ? dataVal : []);
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
    this._categoryWiseDeskOfficerService.delete(rowUuid).subscribe((res:any) => {
      if(res.success){
        this.spinner = false;
        this.toastr.success(res.message, "Success!", this.config);
        this.getListData(); 
      }
      else{
        this.spinner = false;
        this.toastr.error(res.message, "Error!", this.config);
      } 
    });
  }

  editRow(data) {
    this.formTitle = "Edit";
    this.frmGroup.patchValue({
      uuid: data.uuid,
      stFiscalYearId: data.stFiscalYearId,
      stResearchCategoryTypeId: data.stResearchCategoryTypeId,
      catWiseProfileMark: data.catWiseProfileMark,
      catWiseProposalMark: data.catWiseProposalMark,
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
      this._categoryWiseDeskOfficerService.updateData(this.frmGroup.value).subscribe(
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
      this._categoryWiseDeskOfficerService.saveData(this.frmGroup.value).subscribe(
        res => {
          if (res.success) {
            this.spinner = false;
            this.getListData();
            this.formReset();
            this.toastr.success(res.message, "Success!", this.config);
          } else {
            this.spinner = false;
            this.toastr.error(res.message, "Error!", this.config);
          }
        },
        err => {
          console.log('err==== > ', err);
          this.spinner = false;
          this.toastr.error('Http Error Occord !.', "Error!", this.config);
        }
      )
    }
    this.formReset();
  }

  formReset() {
    this.formTitle = 'Add';
    this.frmGroup.reset();
    this.inputForm.resetForm();
    this.frmGroup.patchValue({ active: 'true' });
  }

    /*------------------------/Insert form functions----------------------*/
  getResearchCategoryTypeList() {
    this.spinner = true;
    this._researchCategoryTypeService.getAllActiveList().subscribe(
      res => {
        this.spinner = false;
        this.researchCategoryTypeList = res.items ? res.items : [];
      }
    );
  }

  getFiscalYearList() {
    this.spinner = true;
    this._categoryWiseDeskOfficerService.getActiveFiscalYearList().subscribe(
      res => {
        
        //this.dataSource = res.item.fi
        this.fiscalYearList = res.items ? res.items : [];
        this.spinner = false;
      }
    );
  }


  compareFn(x: any, y: any): boolean {
    return x && y ? x.id === y.id : x === y;
  }

  getUserList() {
    this.userListService.getAllUser().subscribe(
      res => {
        this.userList = res ? res : [];
      }
    );
  }

}
