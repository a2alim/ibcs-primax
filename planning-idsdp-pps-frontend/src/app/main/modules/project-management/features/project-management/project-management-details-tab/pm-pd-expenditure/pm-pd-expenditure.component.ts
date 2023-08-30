import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { GlobalValidationService } from 'app/global/validation/global-validation.service';
import { SnackbarHelper } from 'app/main/core/helper/snackbar.helper';
import { FuseTranslationLoaderService } from 'app/main/core/services/translation-loader.service';
import { PmPdSelectionModel } from 'app/main/modules/project-management/models/pm-pd-selection.model';
import { PmPdSelectionService } from 'app/main/modules/project-management/service/pm-pd-selection.service';
import { locale as lngEnglish } from './i18n/en';
import { locale as lngBangla } from './i18n/bn';
import { ConfirmDialogConstant } from 'app/main/shared/constant/confirm.dialog.constant';
import { SubmitConfirmationDialogComponent } from 'app/main/shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component';
import { ExpenditureModel } from 'app/main/modules/project-management/models/expenditure.model';
import { ExpenditureService } from 'app/main/modules/project-management/service/expenditure.service';
import { FileUploadService } from 'app/main/core/services/file-upload.service';
import { EconomicCodeService } from 'app/main/modules/configuration-management/services/economic-code-service.service';
import { SubEconomicCodeService } from 'app/main/modules/configuration-management/services/sub-economic-code.service';
import { TouchSequence } from 'selenium-webdriver';

@Component({
  selector: 'app-pm-pd-expenditure',
  templateUrl: './pm-pd-expenditure.component.html',
  styleUrls: ['./pm-pd-expenditure.component.scss']
})
export class PmPdExpenditureComponent implements OnInit {

  @Input() dppTappMasterId: number;
  @Input() dppTappMasterUuid: string;
  @Output() goForward = new EventEmitter<boolean>();
  @Output() goBack = new EventEmitter<boolean>();
  @Output() goBackToHome = new EventEmitter<boolean>();
  dataSource: MatTableDataSource<any> = new MatTableDataSource();

  displayedColumns: string[] = ['sl', 'economicCode', 'economicCodeDescription', 'economicSubCode', 'expenditureDate', 'remarks', 'expenditureAmount', 'action'];
  total: number;
  expenditureModel: ExpenditureModel = new ExpenditureModel();
  expenditureList: ExpenditureModel[] = [];
  formGroup: FormGroup;
  spinner: boolean;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('table') table: MatTable<any>;
  @ViewChild('inputForm') inputForm: NgForm;

  economicCodes: any[] = [];
  subEconomicCodes: any[] = [];
  allSubEconomicCodes: any[] = [];

  constructor(
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    private _formBuilder: FormBuilder,
    private sanckbar: SnackbarHelper,
    private validation: GlobalValidationService,
    private expenditureService: ExpenditureService,
    private dialog: MatDialog,
    private fileUploadService: FileUploadService,
    private economicCodeService: EconomicCodeService,
    private subEconomicCodeService: SubEconomicCodeService,
  ) {
    // Language translations
    this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
  }

  ngOnInit(): void {
    this.createForm();
    this.getExpenditureListByDppTappMasterUuid(this.dppTappMasterUuid);
    this.getAllSubEconomicCode();
    this.getEconomicCode();
  }

  createForm() {
    this.formGroup = this._formBuilder.group({
      economicCode: ['', [Validators.required,]],
      economicCodeDescription: ['', ''],
      economicSubCode: ['', ''],
      attachment: ['', ''],
      expenditureDate: ['', ''],
      remarks: ['', ''],
      expenditureAmount: ['', [Validators.required,]]
    });
  }

  handleFileInput(files: FileList) {
    this.expenditureModel.attachmentName = '';
    this.expenditureModel.attachedFile = files.item(0);
  }


  onClickSave() {
    if (!this.formGroup.valid) {
      return this.sanckbar.openErrorSnackBarWithMessage('Please filled required filed!', 'OK');
    }
    this.spinner = true;
    this.expenditureModel.dppTappMasterId = this.dppTappMasterId;
    this.expenditureModel.dppTappMasterUuid = this.dppTappMasterUuid;

    this.expenditureModel.economicCode = this.formGroup.value.economicCode;
    this.expenditureModel.economicCodeDescription = this.formGroup.value.economicCodeDescription;
    this.expenditureModel.economicSubCode = this.formGroup.value.economicSubCode;
    this.expenditureModel.expenditureDate = this.formGroup.value.expenditureDate;
    this.expenditureModel.remarks = this.formGroup.value.remarks;
    this.expenditureModel.expenditureAmount = this.formGroup.value.expenditureAmount;
    this.expenditureService.createExpenditure(this.expenditureModel).subscribe(
      res => {
        if (res.success) {
          this.sanckbar.openSuccessSnackBarWithMessage(res.message, 'OK');
          this.formGroup.reset();
          this.expenditureModel = new ExpenditureModel();
          this.expenditureModel.attachedFile = null;
          this.getExpenditureListByDppTappMasterUuid(this.dppTappMasterUuid);
        } else {
          this.sanckbar.openErrorSnackBarWithMessage(res.message, 'OK');
        }
        this.spinner = false;
      },
      err => {
        this.spinner = false;
        this.sanckbar.openErrorSnackBarWithMessage('Exception occurred on create Expenditure!', 'OK');
      }
    )
  }

  getExpenditureListByDppTappMasterUuid(dppTappMasterUuid) {
    this.spinner = true;
    this.expenditureService.getExpenditureByDppTappMasterUuid(dppTappMasterUuid).subscribe(
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
        this.spinner = false;
      },
      err => {
        this.spinner = false;
      }
    )
  }

  onClickEdit(data) {
    this.getSubEconomicCode({ value: data.economicCode });
    this.formGroup.patchValue({
      economicCode: data.economicCode,
      economicCodeDescription: data.economicCodeDescription,
      economicSubCode: data.economicSubCode,
      attachment: data.attachment,
      expenditureDate: data.expenditureDate,
      remarks: data.remarks,
      expenditureAmount: data.expenditureAmount
    });

    this.expenditureModel.uuid = data.uuid;
    this.expenditureModel.id = data.id;
    this.expenditureModel.economicCode = data.economicCode;
    this.expenditureModel.economicCodeDescription = data.economicCodeDescription;
    this.expenditureModel.economicSubCode = data.economicSubCode;
    this.expenditureModel.attachment = data.attachment;
    this.expenditureModel.attachment.createdOn = null;
    this.expenditureModel.attachment.updatedOn = null;
    this.expenditureModel.attachmentName = data?.attachment?.fileName;
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
        this.spinner = true;
        this.expenditureService.deleteExpenditureByUuid(data.uuid).subscribe(
          res => {
            if (res.success) {
              this.sanckbar.openSuccessSnackBarWithMessage(res.message, 'OK');
              this.getExpenditureListByDppTappMasterUuid(data.dppTappMasterUuid);
            } else {
            }
            this.spinner = false;
          },
          err => {
            this.sanckbar.openErrorSnackBarWithMessage('Exception occurred on delete Expenditure!', 'OK');
            this.spinner = false;
          }
        )
      }
      dialogRef.close(true);
    });
  }

  nextTab() {
    this.onClickSave();
    this.goForward.emit(true);
  }

  previousTab(): void {
    this.goBack.emit(true);
  }

  goToHome(): void {
    this.onClickSave();
    this.goBackToHome.emit(true);
  }


  formReset() {
    this.expenditureModel = new ExpenditureModel();
    this.formGroup.reset();
    this.inputForm.resetForm();
  }

  download(data: any) {
    this.spinner = true;

    if (!data.attachment && !data.attachment.id) {
      return;
    }
    if (!data.attachment.id) {
      return;
    }

    this.expenditureService.getAttachmentByUuid(data.attachment.id).subscribe(res => {
      this.expenditureService.download(res.pathUrl);
      this.spinner = false;
    });
  }


  getEconomicCode(): void {
    this.spinner = true;
    this.economicCodeService.fetchActiveEconomicCodeList().subscribe(res => {
      this.economicCodes = res.map(m => ({
        name: m.economicCode + " [" + m.economicCodeName + "]",
        nameBn: m.economicCodeBng + " [" + m.economicCodeNameBng + "]",
        nameEn: m.economicCode + " [" + m.economicCodeName + "]",
        description: m.description,
        value: m.id
      }));
      this.spinner = false;
    })
  }

  getSubEconomicCode(event: any) {

    let data = this.economicCodes.find(f => f.value === event.value);
    this.formGroup.patchValue({ economicCodeDescription: data ? data.description : '' });

    if (!event.value) {
      this.subEconomicCodes = [];
      return;
    }
    this.subEconomicCodes = [];

    this.subEconomicCodeService.getByEconomicCodeId(event.value).subscribe(
      subEconomicCodes => {
        this.subEconomicCodes = subEconomicCodes.map(m => ({
          name: m.subEconomicCode + " [" + m.subEconomicCodeName + "]",
          nameBn: m.subEconomicCodeBng + " [" + m.subEconomicCodeNameBng + "]",
          nameEn: m.subEconomicCode + " [" + m.subEconomicCodeName + "]",
          value: m.id
        }));
      });
  }

  getAllSubEconomicCode() {
    this.subEconomicCodeService.getActiveSubEconomicCodeList().subscribe(
      subEconomicCodes => {
        this.allSubEconomicCodes = subEconomicCodes.map(m => ({
          name: m.subEconomicCode + " [" + m.subEconomicCodeName + "]",
          nameBn: m.subEconomicCodeBng + " [" + m.subEconomicCodeNameBng + "]",
          nameEn: m.subEconomicCode + " [" + m.subEconomicCodeName + "]",
          value: m.id
        }));
      });
  }

  showEconomicCode(economicCode: number) {
    let name = '';
    if (economicCode) {
      let findData = this.economicCodes.find(f => f.value === economicCode);
      name = findData ? findData.nameEn : '';
    }
    return name;
  }


  showSubEconomicCode(subEconomicCode: number) {
    let name = '';
    if (subEconomicCode) {
      let findData = this.allSubEconomicCodes.find(f => f.value === subEconomicCode);
      name = findData ? findData.nameEn : '';
    }
    return name;
  }


}
