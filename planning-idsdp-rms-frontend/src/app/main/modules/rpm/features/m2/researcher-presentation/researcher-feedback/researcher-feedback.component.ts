import {Component, OnInit} from '@angular/core';
import {UnsubscribeAdapterComponent} from "../../../../../../core/helper/unsubscribeAdapter";
import {PresentationEvaluatorsFeedback} from "../../../../models/PresentationEvaluatorsFeedback";
import {FuseTranslationLoaderService} from "../../../../../../core/services/translation-loader.service";
import {PresentationEvaluatorsFeedbackService} from "../../../../services/presentation-evaluators-feedback.service";
import {ActivatedRoute, Router} from "@angular/router";
import {SnackbarHelper} from "../../../../../../core/helper/snackbar.helper";
import {locale as lngEnglish} from "./i18n/en";
import {locale as lngBangla} from "./i18n/bn";
import {previousIcon, saveIcon} from '../../../../constants/button.constants';
import {MIN_EDITOR_CONFIG} from "../../../../../../core/constants/editor-config";
import {ResearcherProposalService} from "../../../../services/researcher-proposal.service";
import {ResearcherProposal} from "../../../../models/ResearcherProposal";
import {ERROR, OK} from "../../../../../../core/constants/message";

@Component({
    selector: 'app-researcher-feedback',
    templateUrl: './researcher-feedback.component.html',
    styleUrls: ['./researcher-feedback.component.scss']
})
export class ResearcherFeedbackComponent extends UnsubscribeAdapterComponent implements OnInit {

    spinner = true;
    proposalUuid: string;
    proposal: ResearcherProposal;
    feedbackList: PresentationEvaluatorsFeedback[] = [];
    minEditor = MIN_EDITOR_CONFIG;
    saveDisable: boolean = true;
    saveIcon = saveIcon;
    previousIcon = previousIcon;

    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
                private service: PresentationEvaluatorsFeedbackService,
                private researcherProposalService: ResearcherProposalService,
                private activatedRoute: ActivatedRoute,
                private router: Router,
                private snackbarHelper: SnackbarHelper) {
        super();
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

    ngOnInit(): void {
        this.activatedRoute.params.subscribe(params => {
            this.proposalUuid = params['proposalUuid'];
            this.getResearcherProposal();
            this.getAllByResearcherProposalUuid();
        });
    }

    private getResearcherProposal() {
        this.spinner = true;
        this.subscribe$.add(
            this.researcherProposalService.getByUuid(this.proposalUuid).subscribe(res => {
                if (res.success && res.obj) {
                    this.proposal = res.obj;
                }
                this.spinner = false;
            })
        );
    }

    private getAllByResearcherProposalUuid() {
        this.spinner = true;
        this.subscribe$.add(
            this.service.getAllNewFeedbackByResearcherProposalUuid(this.proposalUuid).subscribe(res => {
                if (res.success && res.items) {
                    this.feedbackList = res.items;
                    this.checkedValidation();
                }
                this.spinner = false;
            })
        );
    }

    onSubmit() {
        this.saveDisable = true;
        this.spinner = true;
        this.service.researcherFeedback(this.feedbackList.map(m => ({uuid: m.uuid, researcherFeedback: m.researcherFeedback, pageNo2: m.pageNo2}))).subscribe(res => {
                if (res.success) {
                    this.feedbackList = res.items;
                    this.snackbarHelper.openSuccessSnackBarWithMessage("Researcher\'s Feedback Send", OK);
                } else {
                    this.snackbarHelper.openErrorSnackBarWithMessage(res.message, ERROR);
                }
                this.saveDisable = false;
                this.spinner = false;
            },
            _ => {
                this.saveDisable = false;
                this.spinner = false;
            }
        );
    }

    checkedValidation() {
        this.saveDisable = !this.feedbackList.every(e => e.researcherFeedback && e.pageNo2 && e.pageNo2 > 0);
    }

    previousTab() {
        this.router.navigate(['/feedback-list-page']);
    }
}
