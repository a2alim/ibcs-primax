import { Component, OnInit, EventEmitter, Inject } from '@angular/core';
import { LinkupProposalWithEvaluatorsModel } from 'app/main/modules/rpm/models/LinkupProposalWithEvaluatorsModel';
import { saveIcon, previousIcon, sendIcon, closeIcon, uploadIcon } from 'app/main/modules/rpm/constants/button.constants';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { FuseTranslationLoaderService } from 'app/main/core/services/translation-loader.service';
import { LinkupProposalWithEvaluatorsService } from 'app/main/modules/rpm/services/linkup-proposal-with-evaluators.service';
import { SnackbarHelper } from 'app/main/core/helper/snackbar.helper';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationService } from 'app/main/modules/settings/services/configuration.service';
import { ConfirmDialogConstant } from 'app/main/shared/constant/confirm.dialog.constant';
import { SubmitConfirmationDialogComponent } from 'app/main/shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component';
import { locale as lngEnglish } from "../i18n/en";
import { locale as lngBangla } from "../i18n/bn";
import { FileUploadService } from 'app/main/shared/services/file-upload.service';
import { GuarantorService } from "../../../../services/guarantor.service";
import { UploadFile } from 'app/main/modules/training-institute/models/guarantor-request.model'

@Component({
  selector: 'app-upload-modal',
  templateUrl: './upload-modal.component.html',
  styleUrls: ['./upload-modal.component.scss']
})
export class UploadModalComponent implements OnInit {
  closeEventEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();
  linkupProposalWithEvaluatorsObj: any = {};


  saveIcon = saveIcon;
  previousIcon = previousIcon;
  uploadIcon = uploadIcon;
  sendIcon = sendIcon;
  closeIcon = closeIcon;
  update: boolean;
  spinner = false;
  viewFlag: boolean;
  toolbar = { toolbar: [[]] };
  fiscalYears: any[];
  selectedFiscalYear: number;

  image: UploadFile = new UploadFile();

  constructor(
    @Inject(MAT_DIALOG_DATA) data: any,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    private _linkupProposalWithEvaluatorsService: LinkupProposalWithEvaluatorsService,
    private _snackbarHelper: SnackbarHelper,
    private dialog: MatDialog,
    private _toastService: ToastrService,
    private _guarantorService: GuarantorService,
    private _configurationService: ConfigurationService,
    private _fileUploadService: FileUploadService,
  ) {
    this.linkupProposalWithEvaluatorsObj = data;
    console.log('linkupProposalWithEvaluatorsObj ----- >>>>> ', this.linkupProposalWithEvaluatorsObj);
    this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
  }

  ngOnInit(): void {

  }

  uploadFile(files: FileList, tag: string) {
    this._fileUploadService.uploadFile(files[0], files[0].name, 'rms-ti').subscribe(data => {
      this.image.uploadFile = data;
    })
  }

  onSubmit(send: boolean) {
    this.openDialog(send);
  }

  onClose(value: boolean) {
    this.dialog.closeAll();
  };

  changeFiscalYear() {

  }

  private openDialog(send: boolean) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = false;
    dialogConfig.width = '40%';
    dialogConfig.height = ConfirmDialogConstant.HEIGHT;
    dialogConfig.panelClass = ConfirmDialogConstant.PANEL_CLASS;
    dialogConfig.data = { message: 'Are you sure you want to upload this file?' };
    const dialogRef = this.dialog.open(SubmitConfirmationDialogComponent, dialogConfig);

    dialogRef.componentInstance.closeEventEmitter.subscribe(res => {
      if (res) {
        this._guarantorService.uploadFile(this.image, parseInt(sessionStorage.getItem("upid"))).subscribe(data => {
          this._toastService.success("Uploaded", "Success");
          this.closeEventEmitter.emit(true);
        },
          error => {
            this._toastService.error(error.error.message, "Error");
            console.log("Error: " + error);
            this.onClose(true);
          })
        this.onClose(true);
      }
      dialogRef.close(true);
    });
  }

}

