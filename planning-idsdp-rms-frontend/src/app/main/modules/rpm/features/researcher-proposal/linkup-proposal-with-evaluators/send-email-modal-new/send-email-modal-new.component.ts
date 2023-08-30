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
import {MIN_EDITOR_CONFIG} from "../../../../../../core/constants/editor-config";

@Component({
  selector: 'app-send-email-modal-new',
  templateUrl: './send-email-modal-new.component.html',
  styleUrls: ['./send-email-modal-new.component.scss']
})
export class SendEmailModalNewComponent implements OnInit {

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
  mediumEditorConfig: any = MIN_EDITOR_CONFIG;
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
  }


  onSubmit(send: boolean) {

    console.log('ttttttt ====== >>>>> ',this.linkupProposalWithEvaluatorsObj);

    if ((this.linkupProposalWithEvaluatorsObj.emailFor == 'Evaluator') && (!this.linkupProposalWithEvaluatorsObj.subject || !this.linkupProposalWithEvaluatorsObj.mailBodyContent)) {
      return;
    }

    if ((this.linkupProposalWithEvaluatorsObj.emailFor == 'EvaluatorForProMarks') && (!this.linkupProposalWithEvaluatorsObj.subjectForProMarks || !this.linkupProposalWithEvaluatorsObj.mailBodyContentForProMarks)) {
      return;
    }

    if ((this.linkupProposalWithEvaluatorsObj.emailFor == 'EvaluatorForResearch') && (!this.linkupProposalWithEvaluatorsObj.subjectForResearch || !this.linkupProposalWithEvaluatorsObj.mailBodyContentForResearch)) {
      return;
    }

    if (send) {
      this.openDialog(send);
    } else {
      this.linkupProposalWithEvaluatorsObj.mailStatus = 0;
      this.linkupProposalWithEvaluatorsObj.mailStatusForProMarks = 0;
      this.linkupProposalWithEvaluatorsObj.mailStatusForResearch = 0;
      this.onUpdate(send);
    }
  }

  onUpdate(send: boolean) {
    this.spinner = true;

    ((this.linkupProposalWithEvaluatorsObj.emailFor == 'Evaluator') && !this.linkupProposalWithEvaluatorsObj.reviewStatus) ? this.linkupProposalWithEvaluatorsObj.reviewStatus = 1 : this.linkupProposalWithEvaluatorsObj.reviewStatus = this.linkupProposalWithEvaluatorsObj.reviewStatus;
    ((this.linkupProposalWithEvaluatorsObj.emailFor == 'EvaluatorForProMarks') && !this.linkupProposalWithEvaluatorsObj.reviewStatusForProMarks) ? this.linkupProposalWithEvaluatorsObj.reviewStatusForProMarks = 1 : this.linkupProposalWithEvaluatorsObj.reviewStatusForProMarks = this.linkupProposalWithEvaluatorsObj.reviewStatusForProMarks;
    ((this.linkupProposalWithEvaluatorsObj.emailFor == 'EvaluatorForResearch') && !this.linkupProposalWithEvaluatorsObj.reviewStatusForResearch) ? this.linkupProposalWithEvaluatorsObj.reviewStatusForResearch = 1 : this.linkupProposalWithEvaluatorsObj.reviewStatusForResearch = this.linkupProposalWithEvaluatorsObj.reviewStatusForResearch;

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
        ((this.linkupProposalWithEvaluatorsObj.emailFor == 'Evaluator') && !this.linkupProposalWithEvaluatorsObj.mailStatus) ? this.linkupProposalWithEvaluatorsObj.mailStatus = 1 : this.linkupProposalWithEvaluatorsObj.mailStatus = this.linkupProposalWithEvaluatorsObj.mailStatus;
        ((this.linkupProposalWithEvaluatorsObj.emailFor == 'EvaluatorForProMarks') && !this.linkupProposalWithEvaluatorsObj.mailStatusForProMarks) ? this.linkupProposalWithEvaluatorsObj.mailStatusForProMarks = 1 : this.linkupProposalWithEvaluatorsObj.mailStatusForProMarks = this.linkupProposalWithEvaluatorsObj.mailStatusForProMarks;
        ((this.linkupProposalWithEvaluatorsObj.emailFor == 'EvaluatorForResearch') && !this.linkupProposalWithEvaluatorsObj.mailStatusForResearch) ? this.linkupProposalWithEvaluatorsObj.mailStatusForResearch = 1 : this.linkupProposalWithEvaluatorsObj.mailStatusForResearch = this.linkupProposalWithEvaluatorsObj.mailStatusForResearch;
        this.onUpdate(send);
      }
      dialogRef.close(true);
    });
  }

  onClose(value: boolean) {
    this.dialog.closeAll();
  };

}
