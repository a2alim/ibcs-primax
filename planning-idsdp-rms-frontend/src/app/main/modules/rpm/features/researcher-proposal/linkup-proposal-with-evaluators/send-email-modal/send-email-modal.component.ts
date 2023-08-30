import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { locale as lngEnglish } from "./i18n/en";
import { locale as lngBangla } from "./i18n/bn";
import { FuseTranslationLoaderService } from 'app/main/core/services/translation-loader.service';
import { closeIcon, previousIcon, saveIcon, sendIcon } from '../../../../constants/button.constants';
import { ResearcherProposalSubmissionLetter } from '../../../../models/ResearcherProposalSubmissionLetter';
import { ResearcherProposal } from '../../../../models/ResearcherProposal';
import { MatDialog, MatDialogConfig, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LinkupProposalWithEvaluatorsModel } from '../../../../models/LinkupProposalWithEvaluatorsModel';
import { LinkupProposalWithEvaluatorsService } from '../../../../services/linkup-proposal-with-evaluators.service';
import { SnackbarHelper } from 'app/main/core/helper/snackbar.helper';
import { ERROR, OK } from 'app/main/core/constants/message';
import { ConfirmDialogConstant } from 'app/main/shared/constant/confirm.dialog.constant';
import { SubmitConfirmationDialogComponent } from 'app/main/shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component';



@Component({
  selector: 'app-send-email-modal',
  templateUrl: './send-email-modal.component.html',
  styleUrls: ['./send-email-modal.component.scss']
})


export class SendEmailModalComponent implements OnInit {

  closeEventEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();
  linkupProposalWithEvaluatorsObj: LinkupProposalWithEvaluatorsModel = new LinkupProposalWithEvaluatorsModel();


  saveIcon = saveIcon;
  previousIcon = previousIcon;
  sendIcon = sendIcon;
  closeIcon = closeIcon;
  update: boolean;
  spinner = false;
  viewFlag: boolean;
  toolbar = { toolbar: [[]] };

  constructor(
    @Inject(MAT_DIALOG_DATA) data: LinkupProposalWithEvaluatorsModel,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    private _linkupProposalWithEvaluatorsService: LinkupProposalWithEvaluatorsService,
    private _snackbarHelper: SnackbarHelper,
    private dialog: MatDialog
  ) {
    this.linkupProposalWithEvaluatorsObj = data;
    this.viewFlag = this.linkupProposalWithEvaluatorsObj.viewFlag;
    this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
  }

  ngOnInit(): void {
  }

  uploadImageAsBase64(files: any, propertyName: string) {
    console.log('test');
    // this.utilsService.uploadImageAsBase64(this.form, files, propertyName);
  }


  onSubmit(send: boolean) {
    if (!this.linkupProposalWithEvaluatorsObj.subject || !this.linkupProposalWithEvaluatorsObj.mailBodyContent) {
      return;
    }

    if (send) {
      this.openDialog(send);
    } else {
      this.linkupProposalWithEvaluatorsObj.mailStatus = 0;
      this.onUpdate(send);
    }
  }

  onUpdate(send: boolean) {
    this.spinner = true;
    this._linkupProposalWithEvaluatorsService.update(this.linkupProposalWithEvaluatorsObj).subscribe(
      response => {
        if (response.success) {
          this.linkupProposalWithEvaluatorsObj = response.obj;
          send ? this._snackbarHelper.openSuccessSnackBarWithMessage('Mail has been sent successfully to evaluator!', OK) :
            this._snackbarHelper.openSuccessSnackBarWithMessage(response.message, OK);
          this.spinner = false;
          this.closeEventEmitter.emit(true);
        } else {
          this._snackbarHelper.openErrorSnackBarWithMessage(response.message, ERROR);
          this.spinner = false;
          this.closeEventEmitter.emit(false);
        }

      },
      error => {
        console.log('error ==== >>>> ', error);
        this.spinner = false;
        this.closeEventEmitter.emit(false);
      }
    );
  }

  private openDialog(send: boolean) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = false;
    dialogConfig.width = ConfirmDialogConstant.WIDTH;
    dialogConfig.height = ConfirmDialogConstant.HEIGHT;
    dialogConfig.panelClass = ConfirmDialogConstant.PANEL_CLASS;
    dialogConfig.data = { message: 'Are you sure you want to send this letter?' };
    const dialogRef = this.dialog.open(SubmitConfirmationDialogComponent, dialogConfig);

    dialogRef.componentInstance.closeEventEmitter.subscribe(res => {
      if (res) {
        this.linkupProposalWithEvaluatorsObj.mailStatus = 1;
        this.onUpdate(send);
      }
      dialogRef.close(true);
    });
  }

  onClose(value: boolean) {
    this.dialog.closeAll();
  };

}
