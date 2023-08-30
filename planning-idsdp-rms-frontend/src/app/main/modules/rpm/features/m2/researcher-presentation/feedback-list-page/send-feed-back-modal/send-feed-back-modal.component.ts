import {Component, EventEmitter, Inject, OnInit} from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {SnackbarHelper} from 'app/main/core/helper/snackbar.helper';
import {FuseTranslationLoaderService} from 'app/main/core/services/translation-loader.service';
import {FeedbackBetweenEvaluatorAndResearcher} from 'app/main/modules/rpm/models/FeedbackBetweenEvaAndResearcher';
import {locale as lngEnglish} from "./i18n/en";
import {locale as lngBangla} from "./i18n/bn";
import {closeIcon, previousIcon, saveIcon, sendIcon} from 'app/main/modules/rpm/constants/button.constants';
import {FeedbackBetweenEvaluatorAndResearcherService} from 'app/main/modules/rpm/services/feedback-between-eva-and-researcher.service';
import {ERROR, OK} from 'app/main/core/constants/message';
import {NavigationExtras, Router} from '@angular/router';
import {MIN_EDITOR_CONFIG} from "../../../../../../../core/constants/editor-config";

@Component({
    selector: 'app-send-feed-back-modal',
    templateUrl: './send-feed-back-modal.component.html',
    styleUrls: ['./send-feed-back-modal.component.scss']
})
export class SendFeedBackModalComponent implements OnInit {

    closeEventEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();
    feedbackBetweenEvaluatorAndResearcher: FeedbackBetweenEvaluatorAndResearcher = new FeedbackBetweenEvaluatorAndResearcher();
    spinner: Boolean;


    saveIcon = saveIcon;
    previousIcon = previousIcon;
    sendIcon = sendIcon;
    closeIcon = closeIcon;
    update: boolean;
    mediumEditorConfig: any = MIN_EDITOR_CONFIG;
    constructor(
        @Inject(MAT_DIALOG_DATA) data: FeedbackBetweenEvaluatorAndResearcher,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _snackbarHelper: SnackbarHelper,
        private dialog: MatDialog,
        private _feedbackBetweenEvaluatorAndResearcherService: FeedbackBetweenEvaluatorAndResearcherService,
        private _route: Router,
    ) {
        this.feedbackBetweenEvaluatorAndResearcher = data;
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

    ngOnInit(): void {

        if (this.feedbackBetweenEvaluatorAndResearcher && this.feedbackBetweenEvaluatorAndResearcher.userId && this.feedbackBetweenEvaluatorAndResearcher.sendTo == 'Researcher') {
            this.findUserByUserId(this.feedbackBetweenEvaluatorAndResearcher.userId);
        }

        if (this.feedbackBetweenEvaluatorAndResearcher && this.feedbackBetweenEvaluatorAndResearcher.m2CreateSeminarId && this.feedbackBetweenEvaluatorAndResearcher.sendTo == 'Evaluator') {
            this.findEvaluatorByResearcherProposalId(this.feedbackBetweenEvaluatorAndResearcher.m1ResearcherProposalId);
        }
    }


    onClose(value: boolean) {
        this.dialog.closeAll();
    };

    onSubmit() {
        this.spinner = true;
        this.feedbackBetweenEvaluatorAndResearcher.isSent = false;
        this._feedbackBetweenEvaluatorAndResearcherService.create(this.feedbackBetweenEvaluatorAndResearcher).subscribe(
            response => {
                if (response.success) {
                    this._snackbarHelper.openSuccessSnackBarWithMessage(response.message, OK);
                    this.goToSendFeedBackList(response.obj.uuid);
                } else {
                    this._snackbarHelper.openErrorSnackBarWithMessage(response.message, ERROR);
                }
                this.spinner = false;
            },
            error => {
                console.log('error ==== >>>> ', error);
                this._snackbarHelper.openErrorSnackBarWithMessage('HTTP error occured!.', ERROR);
                this.spinner = false;
            }
        );
    }

    uploadImageAsBase64(files: any, propertyName: string) {
        // this.utilsService.uploadImageAsBase64(this.form, files, propertyName);
    }

    findUserByUserId(userId: number) {
        this.spinner = true;
        this._feedbackBetweenEvaluatorAndResearcherService.findUserByUserId(userId).subscribe(
            response => {
                this.spinner = false;
                if (response.success && response.obj) {
                    this.feedbackBetweenEvaluatorAndResearcher.receiverMailAddress = response.obj.emailId;
                } else {
                    this.feedbackBetweenEvaluatorAndResearcher.receiverMailAddress = '';
                }
            },
            error => {
                console.log('error ==== >>>>> ', error);
                this.spinner = false;
            }
        );
    }


    findEvaluatorByResearcherProposalId(researcherProposalId: number) {
        this.spinner = true;
        this._feedbackBetweenEvaluatorAndResearcherService.findEvaluatorByResearcherProposal(researcherProposalId).subscribe(
            response => {
                this.spinner = false;
                if (response.success && response.obj) {
                    this.feedbackBetweenEvaluatorAndResearcher.receiverMailAddress = response.obj.user.emailId;
                } else {
                    this.feedbackBetweenEvaluatorAndResearcher.receiverMailAddress = '';
                }
            },
            error => {
                console.log('error ==== >>>>> ', error);
                this.spinner = false;
            }
        );
    }

    goToSendFeedBackList(uuid: string) {
        this.onClose(true);
        const navigationExtras: NavigationExtras = {state: this.feedbackBetweenEvaluatorAndResearcher};
        this._route.navigate(['send-feedback-list-page/' + uuid], navigationExtras);
    }


}
