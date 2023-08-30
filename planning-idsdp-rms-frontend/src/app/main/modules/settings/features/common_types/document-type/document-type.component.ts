import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
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
import { ProfessionTbl } from '../../../models/ProfessionTbl';
import { DEFAULT_PAGE, DEFAULT_SIZE } from 'app/main/core/constants/constant';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmDialogConstant } from 'app/main/shared/constant/confirm.dialog.constant';
import { SnackbarHelper } from 'app/main/core/helper/snackbar.helper';
import { SubmitConfirmationDialogComponent } from 'app/main/shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component';

@Component({
  selector: 'app-document-type',
  templateUrl: './document-type.component.html',
  styleUrls: ['./document-type.component.scss']
})
export class DocumentTypeComponent implements OnInit {

  frmGroup: FormGroup;
  config: { timeOut: 5000; closeButton: true; positionClass: 'toast-top-right'; enableHtml: true; };
  formTitle = ''; //Edit

  dataSet: ProfessionTbl[] = new Array<ProfessionTbl>();

  page:number = 0;
  totalElements: number = DEFAULT_SIZE;
  pageSize: number = DEFAULT_PAGE;

  //TODO: This is number of column for Mat Table
  displayedColumns: string[] = ['position', 'profession_name', 'active', 'action'];
  dataSource: any;



  constructor(
      private formBuilder: FormBuilder,
      private _fuseTranslationLoaderService: FuseTranslationLoaderService,
      private api: ApiService,
      private toastr: ToastrService,
      private globalVal: GlobalValidationServiceService,
      private matSnackBar : SnackbarHelper,
      private dialog: MatDialog
      ) {

      // Language translations
      this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);

      //TODO: This Dataset will be come from database though service
      this.dataSet = [
        {uuid: '1', position: 1, profession_name: 'Hydrogen', active:true},
        {uuid: '2', position: 2, profession_name: 'Helium', active:true},
        {uuid: '3', position: 2, profession_name: 'Helium', active:false},
        {uuid: '4', position: 2, profession_name: 'Helium', active:false},
    ];
    this.totalElements = this.dataSet.length;
    this.dataSource = new MatTableDataSource(this.dataSet);
  }

  ngOnInit(): void {
    this.formTitle = 'Add';
    this.frmGroup = this.formBuilder.group({
      profession_name: ['', this.globalVal.trimValidator('Profession name')],
      form_type: ['Specialty', Validators.required],
      active: ['true', Validators.required],
  });
  }

  //Pagination Page Change onChangeClick
  onChangePage(event: PageEvent) {
    this.pageSize = +event.pageSize; // get the pageSize
    this.page = +event.pageIndex; // get the current page
    //this.getProcurementType();
  }

  getListData() {
      const getUrl = 'professions/'+this.page+'/'+this.pageSize;
      this.api.get(getUrl).subscribe(res => {
          this.dataSource = new MatTableDataSource(res.content);
          this.totalElements = res.totalElements;            
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
    this.api.delete('professions/delete/',rowUuid).subscribe(res => {
          if(res.status){
            this.toastr.success(res.message, "Success!", this.config);
            this.getListData(); 
          }
          else{
            this.toastr.error(res.message, "Error!", this.config);
          }         
      });
  }

  editRow(data) {    
      this.formTitle = "Edit";
      this.frmGroup.patchValue(data);      
      this.frmGroup.patchValue({form_type: 'Specialty'});
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
    const url = 'professions/';    
    if (this.formTitle == 'Edit') {
      this.api.update(url + 'edit', this.frmGroup.value).subscribe(
        res => {
          if (res.status) {
           this.toastr.success(res.message, "Success!", this.config);
          }
          if(res.status == 2)
          {
            this.frmGroup.controls["profession_name"].setErrors({ "customError": true });
            this.toastr.error(res.message, "Error!", this.config);
          }         
        }
      )
    }
    else {      
      this.api.post(url+'/add', this.frmGroup.value).subscribe(
        res => {
          if (res.status > 0) {
            this.toastr.success(res.message, "Success!", this.config);
          }
          else
          {
            this.frmGroup.controls["profession_name"].setErrors({ "customError": true });
            this.toastr.error(res.message, "Error!", this.config);
          }        
        }
      )
    }
  }

  formReset(){    
    this.formTitle = 'Add';
    this.frmGroup.reset();
    this.frmGroup.patchValue({ active: 'true' });
  }
  /*------------------------/Insert form functions----------------------*/
}

