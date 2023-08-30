import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
/*----Lng Translation----*/
import { locale as lngEnglish } from './i18n/en';
import { locale as lngBangla } from './i18n/bn';
import { FuseTranslationLoaderService } from 'app/main/core/services/translation-loader.service';
import { SnackbarHelper } from 'app/main/core/helper/snackbar.helper';
import { GlobalValidationService } from 'app/global/validation/global-validation.service';
import { PmPdSelectionModel } from 'app/main/modules/project-management/models/pm-pd-selection.model';
import { PmPdSelectionService } from 'app/main/modules/project-management/service/pm-pd-selection.service';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import moment from 'moment';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmDialogConstant } from 'app/main/shared/constant/confirm.dialog.constant';
import { SubmitConfirmationDialogComponent } from 'app/main/shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-pm-pd-selection',
  templateUrl: './pm-pd-selection.component.html',
  styleUrls: ['./pm-pd-selection.component.scss']
})
export class PmPdSelectionComponent implements OnInit {

  @Input() dppTappMasterId: number;
  @Input() dppTappMasterUuid: string;
  @Output() goForward = new EventEmitter<boolean>();
  @Output() goBack = new EventEmitter<boolean>();
  @Output() goBackToHome = new EventEmitter<boolean>();
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  displayedColumns: string[] = ['sl', 'name', 'designation', 'nid', 'joiningDate', 'endDate', 'action'];
  total: number;
  pdSelectionModel: PmPdSelectionModel = new PmPdSelectionModel();
  pdSelectionList: PmPdSelectionModel[] = [];
  isContinuedDisabled: boolean;
  formGroup: FormGroup;
  isEndDateDisabled: boolean;
  spinner: boolean;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('table') table: MatTable<any>;

  constructor(
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    private _formBuilder: FormBuilder,
    private sanckbar: SnackbarHelper,
    private validation: GlobalValidationService,
    private pmPdSelectionService: PmPdSelectionService,
    private dialog: MatDialog
  ) {
    // Language translations
    this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
  }

  ngOnInit(): void {
    this.createForm();
    this.getPdListByDppTappMasterUuid(this.dppTappMasterUuid);
  }

  createForm() {
    this.formGroup = this._formBuilder.group({
      name: ['', [Validators.required,]],
      designation: ['', ''],
      nid: ['', [
        this.validation.checkSpecialChar('this'),
        this.validation.checkString('this')
      ]],
      joiningDate: ['', ''],
      endDate: ['', ''],
      continuing: [false, ''],
      attachmentName: ['', ''],
    });

  }

  handleFileInput(files: FileList) {
    this.pdSelectionModel.attachmentName = '';
    this.pdSelectionModel.attachedFile = files.item(0);
  }

  onClickEndDate() {
    this.isContinuedDisabled = this.formGroup.get('endDate').value ? true : null;
  }

  onClickEndContinuing() {
    this.isEndDateDisabled = !this.isEndDateDisabled;
  }

  onClickSave() {
    if (!this.formGroup.valid) {
      return this.sanckbar.openErrorSnackBarWithMessage('Please filled required filed!', 'OK');
    }
    this.spinner = true;
    this.pdSelectionModel.dppTappMasterId = this.dppTappMasterId;
    this.pdSelectionModel.dppTappMasterUuid = this.dppTappMasterUuid;
    this.pdSelectionModel.name = this.formGroup.value.name;
    this.pdSelectionModel.designation = this.formGroup.value.designation;
    this.pdSelectionModel.nid = this.formGroup.value.nid;
    this.pdSelectionModel.joiningDate = this.formGroup.value.joiningDate;
    this.pdSelectionModel.continuing = this.formGroup.value.continuing;
    this.pdSelectionModel.endDate = this.formGroup.value.endDate;
    this.pmPdSelectionService.createPdSelection(this.pdSelectionModel).subscribe(
      res => {
        if (res.success) {
          this.sanckbar.openSuccessSnackBarWithMessage(res.message, 'OK');
          this.formGroup.reset();
          this.formGroup.patchValue({ nid: '' });
          this.pdSelectionModel = new PmPdSelectionModel();
          this.pdSelectionModel.attachedFile = null;
          this.getPdListByDppTappMasterUuid(this.dppTappMasterUuid);
        } else {
          this.sanckbar.openErrorSnackBarWithMessage(res.message, 'OK');
        }
        this.spinner = false;
      },
      err => {
        this.spinner = false;
        this.sanckbar.openErrorSnackBarWithMessage('Exception occurred on create PD selection!', 'OK');
      }
    )
  }

  getPdListByDppTappMasterUuid(dppTappMasterUuid) {
    this.pmPdSelectionService.getPdListByDppTappMasterUuid(dppTappMasterUuid).subscribe(
      res => {
        this.total = 0;
        if (res.success && res.items) {
          this.total = res.items.length;
          this.dataSource = new MatTableDataSource(res.items);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
        } else {
          this.dataSource = new MatTableDataSource();
        }
      },
      err => {
      }
    )
  }

  onClickEdit(data) {
    this.formGroup.patchValue({
      name: data.name,
      designation: data.designation,
      nid: data.nid,
      joiningDate: data.joiningDate,
      endDate: data.endDate,
      continuing: data.continuing,
    });
    this.pdSelectionModel.uuid = data.uuid;
    this.pdSelectionModel.id = data.id;
    this.pdSelectionModel.pmPdSelectionId = data.pmPdSelectionId;
    this.pdSelectionModel.attachment = data.attachment;
    this.pdSelectionModel.attachment.createdOn = null;
    this.pdSelectionModel.attachment.updatedOn = null;
    this.pdSelectionModel.attachmentName = data?.attachment?.fileName;
  }

  onClickDelete(data) {
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
        this.pmPdSelectionService.deletePdSelectionByUuid(data.uuid).subscribe(
          res => {
            if (res.success) {
              this.sanckbar.openSuccessSnackBarWithMessage(res.message, 'OK');
              this.getPdListByDppTappMasterUuid(data.dppTappMasterUuid);
            } else {
            }
          },
          err => {
            this.sanckbar.openErrorSnackBarWithMessage('Exception occurred on delete PD!', 'OK');
          }
        )
      }
      dialogRef.close(true);
    });
  }

  nextTab() {
    this.goForward.emit(true);
  }

  previousTab(): void {
    this.goBack.emit(true);
  }

  goToHome(): void {
    this.goBackToHome.emit(true);
  }

}
