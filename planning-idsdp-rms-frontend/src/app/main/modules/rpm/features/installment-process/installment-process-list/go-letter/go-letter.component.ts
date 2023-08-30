import { Component, EventEmitter, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { MatDialog, MatDialogConfig, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { DEFAULT_SIZE } from 'app/main/core/constants/constant';
import { SnackbarHelper } from 'app/main/core/helper/snackbar.helper';
import { ApiService } from 'app/main/core/services/api/api.service';
import { DataComService } from 'app/main/core/services/data-com/data-com.service';
import { GlobalValidationServiceService } from 'app/main/core/services/global-validation-service.service';
import { FuseTranslationLoaderService } from 'app/main/core/services/translation-loader.service';
import { addNewIcon, closeIcon, deleteIcon, editIcon, previousIcon, refreshIcon, viewIcon } from 'app/main/modules/rpm/constants/button.constants';
import { CreateGoLetterServiceService } from 'app/main/modules/rpm/services/create-go-letter-service.service';
import { InstallmentProcessService } from 'app/main/modules/rpm/services/installment-process.service';
import { SubmitConfirmationDialogComponent } from 'app/main/shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component';
import { ConfirmDialogConstant } from 'app/main/shared/constant/confirm.dialog.constant';

import { Subscription } from 'rxjs/internal/Subscription';
import { UploadFileModalComponent } from '../../../create-go-letter/upload-file-modal/upload-file-modal.component';
import { locale as lngEnglish } from "./i18n/en";
import { locale as lngBangla } from "./i18n/bn";
import { GoLetterModel } from 'app/main/modules/rpm/models/GoLetterModel';
import { ToastrService } from 'ngx-toastr';
import { GoLetterServiceService } from 'app/main/modules/rpm/services/go-letter-service.service';
import { MIN_EDITOR_CONFIG } from 'app/main/core/constants/editor-config';

@Component({
  selector: 'app-go-letter',
  templateUrl: './go-letter.component.html',
  styleUrls: ['./go-letter.component.scss']
})
export class GoLetterComponent implements OnInit {

  @ViewChild("ckeditor") ckeditor: any;
  @ViewChild('inputForm') inputForm: NgForm;
  closeEventEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();

  /*----Button---*/
  editIcon = editIcon;
  deleteIcon = deleteIcon;
  addNewIcon = addNewIcon;
  viewIcon = viewIcon;
  refreshIcon = refreshIcon;
  previousIcon = previousIcon;
  closeIcon = closeIcon;
  /*----/Button---*/
  subscription: Subscription;
  spinner: boolean = false;
  frmGroup: FormGroup;
  config: { timeOut: 5000; closeButton: true; positionClass: 'toast-top-right'; enableHtml: true; };
  formTitle = 'Save'; //Edit

  page: number = 0;
  totalElements: number = DEFAULT_SIZE;
  pageSize: number = DEFAULT_SIZE;
  templateType: any;
  predifinedTemplate: any;
  installmentProcess: any;
  getInstallmentProcess: any;
  submitData: any;
  dataSource: any;
  templateId: any;
  predifinedTemplateId: any;
  element: any;

  getInstallmentType: any;
  getTkAmount: any;
  getResearchTitle: any;
  getCategory: any;
  getFiscalYear: any;
  goUuid: any;

  goLetterModel: GoLetterModel = new GoLetterModel();
  installmentPlaceholder: any[] = [];

  //TODO: This is number of column for Mat Table
  displayedColumns: string[] = ['position', 'Subject', 'tempType', 'preTemplate', 'ReceiveBankCheque', 'action'];
  mediumEditorConfig: any = MIN_EDITOR_CONFIG;

  constructor(
    @Inject(MAT_DIALOG_DATA) data: GoLetterModel,
    private formBuilder: FormBuilder,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    private toastr: ToastrService,
    private matSnackBar: SnackbarHelper,
    private dialog: MatDialog,
    private router: Router,
    private globalVal: GlobalValidationServiceService,
    private _createGoLetterServiceService: CreateGoLetterServiceService,
    private _goLetterServiceService: GoLetterServiceService,
    private getGoLetterID: CreateGoLetterServiceService,
    private getElement: CreateGoLetterServiceService,
    private _installmentProcess: InstallmentProcessService,
    private _route: Router,
  ) {
    // Language translations
    this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    this.goLetterModel = data;    
    this.installmentPlaceholder = JSON.parse(data.installmentProcess.installmentTypes);    
  }

  ngOnInit(): void {
    this.onCreateForm();
    this.getActiveTemplateType();
    this.getInstallmentProcessById();

    this.formTitle = this.goLetterModel.id != null ? 'Edit' : 'Save';
    if (this.goLetterModel.id) {
      this.frmGroup.controls["subject"].setValue(this.goLetterModel.subject);
      this.frmGroup.controls["mailData"].setValue(this.goLetterModel.mailBody);
      this.frmGroup.controls["templateType"].setValue(this.goLetterModel.templateTypeId);
      this.frmGroup.controls["approvedStatus"].setValue(this.goLetterModel.approvedStatus);
      this.frmGroup.controls["enothiNumber"].setValue(this.goLetterModel.enothiNumber);
      this.frmGroup.controls["bnDate"].setValue(this.goLetterModel.bnDate);
      this.frmGroup.controls["enDate"].setValue(this.goLetterModel.enDate);
      this._createGoLetterServiceService.getPredefineTemplateTypeBySelectedTemplateType(this.goLetterModel.templateTypeId).subscribe(
        res => {
          this.predifinedTemplate = res.items;
          this.frmGroup.controls["predefineTemplate"].setValue(this.goLetterModel.predefinedTemplateId);
        });
    }

  }

  onCreateForm() {
    this.frmGroup = this.formBuilder.group({
      uuid: [''],
      id: [''],
      subject: ['', [this.globalVal.trimValidator('Subject')]],
      templateType: ['', [this.globalVal.trimValidator('Template Type')]],
      predefineTemplate: ['', [this.globalVal.trimValidator('Predefine Template')]],
      mailData: ['', [this.globalVal.trimValidator('Mail Data')]],
      isSend: [false],
      approvedStatus: [''],
      enothiNumber: [''],
      bnDate: [''],
      enDate: [''],
    });
  }

  //Pagination Page Change onChangeClick
  compareFn(x: any, y: any): boolean {
    return x && y ? x.id === y : x.id === y;
  }

  onSubmit() {
    if (this.goLetterModel.id) {
      this.onUpdate();
    } else {
      this.onSave();
    }
  }

  onSave() {
    this.submitData = {
      "researcherProposalId": this.installmentProcess.m1ResearcherProposalId.id,
      "installmentProcessId": this.installmentProcess.id,
      "installmentTypeId": this.installmentProcess.stInstallmentTypeId,
      "fiscalYearId": this.installmentProcess.m1ResearcherProposalId.stFiscalYearId,
      "researchCatTypeId": this.installmentProcess.researchCategoryType.id,
      "totalAmount": this.installmentProcess.tkAmount,
      "subject": this.frmGroup.value.subject,
      "mailBody": this.frmGroup.value.mailData,
      "templateTypeId": this.templateId,
      "predefinedTemplateId": this.predifinedTemplateId,
      "isSend": this.frmGroup.value.isSend,
      "approvedStatus": this.frmGroup.value.approvedStatus,
      "enothiNumber": this.frmGroup.value.enothiNumber,
      "bnDate": this.frmGroup.value.bnDate,
      "enDate": this.frmGroup.value.enDate,
      "bucketName": this.goLetterModel.bucketName,
      "fileDownloadUrl": this.goLetterModel.fileDownloadUrl,
      "fileName": this.goLetterModel.fileName
    };

    this.spinner = true;
    this._goLetterServiceService.create(this.submitData).subscribe(
      res => {
        if (res.success) {
          this._installmentProcess.updateById(res.obj.installmentProcessId, res.obj.uuid).subscribe(data => {
            if (data.success) {
              this.spinner = false;
              this.toastr.success(res.message, "", this.config);
              this.reset();
            }
          });
          this.closeEventEmitter.emit(true);
        } else {
          this.spinner = false;
          this.toastr.error(res.message, "", this.config);
          this.closeEventEmitter.emit(false);
        }
      },
      error => {
        this.toastr.error('Http error occeared !.', "", this.config);
        this.spinner = false;
        this.closeEventEmitter.emit(false);
      }
    );
  }

  onUpdate() {
    this.submitData = {
      "id": this.goLetterModel.id,
      "uuid": this.goLetterModel.uuid,
      "goCode": this.goLetterModel.goCode,
      "researcherProposalId": this.installmentProcess.m1ResearcherProposalId.id,
      "installmentProcessId": this.installmentProcess.id,
      "installmentTypeId": this.installmentProcess.stInstallmentTypeId,
      "fiscalYearId": this.installmentProcess.m1ResearcherProposalId.stFiscalYearId,
      "researchCatTypeId": this.installmentProcess.researchCategoryType.id,
      "totalAmount": this.installmentProcess.tkAmount,
      "subject": this.frmGroup.value.subject,
      "mailBody": this.frmGroup.value.mailData,
      "templateTypeId": this.templateId ? this.templateId : this.goLetterModel.templateTypeId,
      "predefinedTemplateId": this.predifinedTemplateId ? this.predifinedTemplateId : this.goLetterModel.predefinedTemplateId,
      "isSend": this.frmGroup.value.isSend,
      "approvedStatus": this.frmGroup.value.approvedStatus,
      "enothiNumber": this.frmGroup.value.enothiNumber,
      "bnDate": this.frmGroup.value.bnDate,
      "enDate": this.frmGroup.value.enDate,
      "bucketName": this.goLetterModel.bucketName,
      "fileDownloadUrl": this.goLetterModel.fileDownloadUrl,
      "fileName": this.goLetterModel.fileName
    };

    this.spinner = true;
    this._goLetterServiceService.update(this.submitData).subscribe(
      res => {
        if (res.success) {
          this.spinner = false;
          this.toastr.success(res.message, "", this.config);
          this.reset();
          this.closeEventEmitter.emit(true);
        } else {
          this.spinner = false;
          this.toastr.error(res.message, "", this.config);
          this.closeEventEmitter.emit(false);
        }
      },
      error => {
        this.toastr.error('Http error occeared !.', "", this.config);
        this.spinner = false;
        this.closeEventEmitter.emit(false);
      }
    );
  }

  getInstallmentProcessById() {
    this._createGoLetterServiceService.getInstallmentProcessById(this.goLetterModel.installmentProcessId).subscribe(res => {
      this.installmentProcess = res.obj;
      this.getFiscalYear = this.installmentProcess.fiscalYearResponse.fiscalYear;
      this.getInstallmentType = this.installmentProcess.installmentType ? this.installmentProcess.installmentType.installmentType : 'Not Found';
      this.getTkAmount = this.installmentProcess.tkAmount;
      this.getCategory = this.installmentProcess.researchCategoryType.categoryName;
      this.getResearchTitle = this.installmentProcess.m1ResearcherProposalId.researchTitle;
    });
  }

  getActiveTemplateType() {
    this._createGoLetterServiceService.getAllActiveTemplateType().subscribe(res => {
      this.templateType = res.items;
    });
  }

  selectTemplateType(event) {
    this.templateId = event.id;
    this.ckeditor.instance.setData('');
    this._createGoLetterServiceService.getPredefineTemplateTypeBySelectedTemplateType(event.id).subscribe(res => {
      this.predifinedTemplate = res.items;
    });
  }

  selectPredefinedTemplate(event) {
    this.predifinedTemplateId = event.id;

    if (!event.header == null || event.header != '') {
      this.ckeditor.instance.setData(event.header);
    } else {
      this.ckeditor.instance.setData('');
    }
  }

  button() {
    this.formTitle = 'Edit'
    this.ckeditor.instance.setData('');
  }

  reset() {
    this.formTitle = 'Save';
    this.frmGroup.reset();
    this.inputForm.resetForm();
    setTimeout(() => {
      this.ckeditor.instance.setData('');
    }, 500);
  }

  receiveBankCheck(): void {
    this._route.navigate(['receive-bank-cheque']).then(r => console.log(r));
  }

  back() {
    this.formTitle = "Save"
    this.getElement.mode = "Save"
    this.router.navigate([`installment-process`]);
  }

  onClose(value: boolean) {
    this.dialog.closeAll();
  };

}
