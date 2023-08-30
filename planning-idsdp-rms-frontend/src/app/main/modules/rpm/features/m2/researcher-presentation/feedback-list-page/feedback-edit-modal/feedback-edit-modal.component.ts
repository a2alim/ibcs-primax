import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SnackbarHelper } from 'app/main/core/helper/snackbar.helper';
import { FuseTranslationLoaderService } from 'app/main/core/services/translation-loader.service';
import { FeedbackBetweenEvaluatorAndResearcher } from 'app/main/modules/rpm/models/FeedbackBetweenEvaAndResearcher';
import { FeedbackBetweenEvaluatorAndResearcherService } from 'app/main/modules/rpm/services/feedback-between-eva-and-researcher.service';
import { locale as lngEnglish } from "./i18n/en";
import { locale as lngBangla } from "./i18n/bn";
import { PresentationEvaluatorsFeedback } from 'app/main/modules/rpm/models/PresentationEvaluatorsFeedback';
import { closeIcon, previousIcon, saveIcon } from 'app/main/modules/rpm/constants/button.constants';
import { PresentationEvaluatorsFeedbackService } from 'app/main/modules/rpm/services/presentation-evaluators-feedback.service';
import { ERROR, OK, SUCCESSFULLY_SAVE } from 'app/main/core/constants/message';
import { MIN_EDITOR_CONFIG } from 'app/main/core/constants/editor-config';

@Component({
  selector: 'app-feedback-edit-modal',
  templateUrl: './feedback-edit-modal.component.html',
  styleUrls: ['./feedback-edit-modal.component.scss']
})
export class FeedbackEditModalComponent implements OnInit {

  spinner = false;
  feedbackUuid: string;
  feedback: PresentationEvaluatorsFeedback = new PresentationEvaluatorsFeedback();
  saveDisable: boolean = true;
  saveIcon = saveIcon;
  previousIcon = previousIcon;
  minEditor = MIN_EDITOR_CONFIG;
  closeIcon = closeIcon;

  closeEventEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();


  constructor(
    @Inject(MAT_DIALOG_DATA) data: PresentationEvaluatorsFeedback,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    private _snackbarHelper: SnackbarHelper,
    private dialog: MatDialog,
    private service: PresentationEvaluatorsFeedbackService,
  ) {
    this.feedback = data;
    this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
  }

  ngOnInit(): void {
    console.log('feedback === >>>> ', this.feedback);
  }

  checkValidation() {
    this.saveDisable = !(this.feedback.evaluatorFeedback && this.feedback.pageNo1 && this.feedback.pageNo1 > 0);
  }

  onSubmit() {
    this.saveDisable = true;
    this.spinner = true;
    this.feedback.isNew = false;
    this.service.update(this.feedback).subscribe(res => {
      if (res.success) {
        this.feedback = res.obj;
        this._snackbarHelper.openSuccessSnackBarWithMessage(SUCCESSFULLY_SAVE, OK);
        this.closeEventEmitter.emit(true);
      } else {
        this._snackbarHelper.openErrorSnackBarWithMessage(res.message, ERROR);
        this.closeEventEmitter.emit(false);
      }
      this.saveDisable = false;
      this.spinner = false;
    },
      _ => {
        this.saveDisable = false;
        this.spinner = false;
        this.closeEventEmitter.emit(false);
      }
    );
  }

  onClose(value: boolean) {
    this.dialog.closeAll();
  };


}
