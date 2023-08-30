import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SnackbarHelper } from 'app/main/core/helper/snackbar.helper';
import { FuseTranslationLoaderService } from 'app/main/core/services/translation-loader.service';
import { closeIcon, previousIcon, saveIcon, sendIcon, uploadIcon } from 'app/main/modules/rpm/constants/button.constants';
import { LinkupProposalWithEvaluatorsModel } from 'app/main/modules/rpm/models/LinkupProposalWithEvaluatorsModel';
import { LinkupProposalWithEvaluatorsService } from 'app/main/modules/rpm/services/linkup-proposal-with-evaluators.service';
import { ConfigurationService } from 'app/main/modules/settings/services/configuration.service';
import { ToastrService } from 'ngx-toastr';
import {locale as lngEnglish} from "../i18n/en";
import {locale as lngBangla} from "../i18n/bn";
import { ConfirmDialogConstant } from 'app/main/shared/constant/confirm.dialog.constant';
import { SubmitConfirmationDialogComponent } from 'app/main/shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component';
import {FileUploadService} from "../../../../../../shared/services/file-upload.service";
import {ENothiModel} from "../../../../models/e-nothi.model";
import {ENothiService} from "../../../../services/eNothi.service";

@Component({
  selector: 'app-upload-e-nothi',
  templateUrl: './upload-e-nothi.component.html',
  styleUrls: ['./upload-e-nothi.component.scss']
})
export class UploadENothiComponent implements OnInit {

  closeEventEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();
  linkupProposalWithEvaluatorsObj: LinkupProposalWithEvaluatorsModel = new LinkupProposalWithEvaluatorsModel();


  saveIcon = saveIcon;
  uploadIcon = uploadIcon;
  previousIcon = previousIcon;
  sendIcon = sendIcon;
  closeIcon = closeIcon;
  update: boolean;
  spinner = false;
  viewFlag: boolean;
  toolbar = {toolbar: [[]]};
  fiscalYears: any[];
  selectedFiscalYear: number;
  eNothi: ENothiModel = new ENothiModel();
  fiscalYearId: number;

  constructor(
      @Inject(MAT_DIALOG_DATA) data: LinkupProposalWithEvaluatorsModel,
      private _fuseTranslationLoaderService: FuseTranslationLoaderService,
      private _fileUploadService: FileUploadService,
      private _eNothiService: ENothiService,
      private _snackbarHelper: SnackbarHelper,
      private dialog: MatDialog,
      private _toastService: ToastrService,
      private _configurationService: ConfigurationService
  ) {
      this.linkupProposalWithEvaluatorsObj = data;
      this.viewFlag = this.linkupProposalWithEvaluatorsObj.viewFlag;
      this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
  }

  ngOnInit(): void {
      this.getFiscalYears();
  }

  onSubmit(send: boolean) {
console.log(this.eNothi);
console.log(this.fiscalYearId);
      this.openDialog(send);
  }

  onClose(value: boolean) {
      this.dialog.closeAll();
  };

  changeFiscalYear() {
    console.log(this.fiscalYearId);
    
///thi
  }

  uploadFile(files: FileList, tag: string) {
    if (tag === 'profile_image') {
        this._fileUploadService.uploadFile(files[0], files[0].name, 'rms-ti').subscribe(data => {
            this.eNothi.enothi = data;
        })
    }
}

  private openDialog(send: boolean) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = false;
      dialogConfig.autoFocus = false;
      dialogConfig.width = '40%';
      dialogConfig.height = ConfirmDialogConstant.HEIGHT;
      dialogConfig.panelClass = ConfirmDialogConstant.PANEL_CLASS;
      dialogConfig.data = {message: 'Are you sure you want to upload this E-Nothi?'};
      const dialogRef = this.dialog.open(SubmitConfirmationDialogComponent, dialogConfig);

      dialogRef.componentInstance.closeEventEmitter.subscribe(res => {
          if (res) {
            console.log(res);
            this._eNothiService.uploadENothi(this.eNothi).subscribe(data => {
              this._toastService.success("E-Nothi Uploaded", "Success")
              console.log(data)
          },
          error => {
              this._toastService.error(error.error.message, "Error");
              console.log("Error: " + error);
              this.onClose(true)
          })
              
              this.onClose(true)
          }
          dialogRef.close(true);
      });
  }

  private getFiscalYears() {
      this._configurationService.getAllFiscalYearByFinalCopy().subscribe(
          res => {
              this.fiscalYears = res.items;
          },
          error => {
              console.log(error)
          }
      )
  }
}

