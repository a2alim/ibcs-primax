import {Component, OnInit} from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ActivatedRoute, Router} from '@angular/router';
import {SnackbarHelper} from 'app/main/core/helper/snackbar.helper';
import {FuseTranslationLoaderService} from 'app/main/core/services/translation-loader.service';
import {AuthService} from 'app/main/modules/auth/services/auth.service';
import {
    addNewIcon,
    downloadIcon,
    editIcon,
    noteIcon,
    previousIcon,
    printIcon,
    sendIcon
} from 'app/main/modules/rpm/constants/button.constants';
import {PresentationEvaluatorsFeedbackService} from 'app/main/modules/rpm/services/presentation-evaluators-feedback.service';
import {ExpertEvaluatorService} from 'app/main/modules/settings/services/expert-evaluator.service';
import {FiscalYearServiceService} from 'app/main/modules/settings/services/fiscal-year-service.service';
import {ResearchCategoryTypeService} from 'app/main/modules/settings/services/research-category-type.service';
import {locale as lngEnglish} from "../i18n/en";
import {locale as lngBangla} from "../i18n/bn";
import {PresentationEvaluatorsFeedback} from 'app/main/modules/rpm/models/PresentationEvaluatorsFeedback';
import {FeedbackEditModalComponent} from '../feedback-edit-modal/feedback-edit-modal.component';
import {ERROR, OK, SUCCESSFULLY_SAVE} from 'app/main/core/constants/message';
import {FeedbackBetweenEvaluatorAndResearcher} from 'app/main/modules/rpm/models/FeedbackBetweenEvaAndResearcher';
import {FeedbackBetweenEvaluatorAndResearcherService} from 'app/main/modules/rpm/services/feedback-between-eva-and-researcher.service';
import {ResearcherProposal} from "../../../../../models/ResearcherProposal";
import {ResearcherProposalService} from "../../../../../services/researcher-proposal.service";

@Component({
    selector: 'app-send-feed-back-list-page',
    templateUrl: './send-feed-back-list-page.component.html',
    styleUrls: ['./send-feed-back-list-page.component.scss']
})
export class SendFeedBackListPageComponent implements OnInit {

    researcherProposalUuid: string;
    spinner = false;
    feedbackBetweenEvaluatorAndResearcher: FeedbackBetweenEvaluatorAndResearcher = new FeedbackBetweenEvaluatorAndResearcher();
    feedbackBetweenEvaAndResearcherUuid;
    feedback: FeedbackBetweenEvaluatorAndResearcher;
    proposal: ResearcherProposal;

    /*----Button---*/
    previousIcon = previousIcon;
    downloadIcon = downloadIcon;
    printIcon = printIcon;
    noteIcon = noteIcon;
    editIcon = editIcon;
    addNewIcon = addNewIcon;
    sendIcon = sendIcon;
    /*----/Button---*/

    feedbackList: any[] = [];
    // evaluatorList: any[] = [];
    // researchCategoryTypeList: any[] = [];
    // fiscalYearList: any[] = [];
    evaluatorUserList: any[] = [];
    fromData: any = {};
    saveDisable: boolean = false;
    navigation: any;

    constructor(private activateRoute: ActivatedRoute,
                private _fuseTranslationLoaderService: FuseTranslationLoaderService,
                private _presentationEvaluatorsFeedbackService: PresentationEvaluatorsFeedbackService,
                private researcherProposalService: ResearcherProposalService,
                private _researchCategoryTypeService: ResearchCategoryTypeService,
                private _fiscalYearService: FiscalYearServiceService,
                private _expertEvaluatorService: ExpertEvaluatorService,
                private _dialog: MatDialog,
                private service: PresentationEvaluatorsFeedbackService,
                private _snackbarHelper: SnackbarHelper,
                private router: Router,
                private authService: AuthService,
                private _feedbackBetweenEvaluatorAndResearcherService: FeedbackBetweenEvaluatorAndResearcherService,) {
        this.navigation = this.router.getCurrentNavigation();
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

    ngOnInit(): void {
        this.feedbackBetweenEvaAndResearcherUuid = this.activateRoute.snapshot.paramMap.get('feedbackBetweenEvaAndResearcherUuid');
        this.getFeedbackBetweenEvaluatorAndResearcher();

        // this.getEvaluatorList();
        // this.getResearchCategoryTypeList();
        // this.getFiscalYearList();
        this.authService.getLoggedUserDetailsById();

        this.authService.getLoggedUserDetailsById().subscribe(
            response => {
                this.fromData = response;
            }
        );

        if (this.navigation && this.navigation.extras && this.navigation.extras.state) {
            this.feedbackBetweenEvaluatorAndResearcher = this.navigation.extras.state as FeedbackBetweenEvaluatorAndResearcher;
        }

        if (this.feedbackBetweenEvaluatorAndResearcher) {
            this.findAllByResearcherProposalId();
        }

        if (this.feedbackBetweenEvaluatorAndResearcher && this.feedbackBetweenEvaluatorAndResearcher.userId && this.feedbackBetweenEvaluatorAndResearcher.sendTo == 'Researcher') {
            this.findUserByUserId(this.feedbackBetweenEvaluatorAndResearcher.userId);
        }

        if (this.feedbackBetweenEvaluatorAndResearcher && this.feedbackBetweenEvaluatorAndResearcher.m2CreateSeminarId && this.feedbackBetweenEvaluatorAndResearcher.sendTo == 'Evaluator') {
            this.findEvaluatorByResearcherProposalId(this.feedbackBetweenEvaluatorAndResearcher.m1ResearcherProposalId);
        }

    }

    private getFeedbackBetweenEvaluatorAndResearcher() {
        this.spinner = true;
        this._feedbackBetweenEvaluatorAndResearcherService.getByUuid(this.feedbackBetweenEvaAndResearcherUuid).subscribe(res => {
            if (res.success && res.obj) {
                this.feedback = res.obj;
                this.getProposal(res.obj.m1ResearcherProposalId);
            }
            this.spinner = false;
        });
    }

    private getProposal(m1ResearcherProposalId: number) {
        this.spinner = true;
        this.researcherProposalService.getById(m1ResearcherProposalId).subscribe(res => {
            if (res.success && res.obj) {
                this.proposal = res.obj;
                console.log('proposal ----- >>>>> ',this.proposal);
                this.findAllByResearcherProposalId();
            }
            this.spinner = false;
        });
    }

    findAllByResearcherProposalId() {
        this.spinner = true;
        this._presentationEvaluatorsFeedbackService.findAllByResearcherProposalId(this.proposal.uuid).subscribe(
            response => {
                if (response.success && response.items) {
                    this.feedbackList = response.items ? response.items : [];
                }
                this.spinner = false;
            },
            error => {
                this.spinner = false;
                console.log('error === >>> ', error);
            }
        );
    }


    /*getResearchCategoryTypeList() {
        this.spinner = true;
        this._researchCategoryTypeService.getAllActiveList().subscribe(
            response => {
                this.researchCategoryTypeList = response.items ? response.items : [];
                this.spinner = false;
            }
        );
    }


    getFiscalYearList() {
        this.spinner = true;
        this._fiscalYearService.getAllActive().subscribe(
            response => {
                this.fiscalYearList = response.items ? response.items : [];
                this.spinner = false;
            },
            error => {
                this.spinner = false;
            }
        );
    }


    getEvaluatorList() {
        this.spinner = true;
        this._expertEvaluatorService.getAll().subscribe(
            response => {
                this.evaluatorList = response.items ? response.items : [];
                this.spinner = false;
            },
            error => {
                console.log('error === >>>> ', error);
            }
        );
        this.spinner = false;
    }


    onShowEvaluator(evaluatorId: number) {
        if (!evaluatorId) {
            return '';
        }
        const findData = this.evaluatorList.find(f => f.id == evaluatorId);
        if (findData) {
            return findData.name;
        }

        return '';
    }

    onShowCategory(categoryId: number) {
        if (!categoryId) {
            return '';
        }
        const findData = this.researchCategoryTypeList.find(f => f.id == categoryId);
        if (findData) {
            return findData.categoryName;
        }
        return '';
    }

    onShowFiscalYear(fiscalYearId: number) {
        if (!fiscalYearId) {
            return '';
        }
        const findData = this.fiscalYearList.find(f => f.id == fiscalYearId);
        if (findData) {
            return findData.fiscalYear;
        }
        return '';
    }*/

    onEditEvaluatorFeedback(data: any) {
        const presentationEvaluatorsFeedback = new PresentationEvaluatorsFeedback();
        presentationEvaluatorsFeedback.id = data.id;
        presentationEvaluatorsFeedback.uuid = data.uuid;
        presentationEvaluatorsFeedback.m2ResearcherPresentationId = data.researcherPresentation.id;
        presentationEvaluatorsFeedback.m1ResearcherProposalId = data.researcherProposal.id;
        presentationEvaluatorsFeedback.stProfileOfExpertEvaluatorsId = data.stProfileOfExpertEvaluatorsId;
        presentationEvaluatorsFeedback.m2AddNewMemberId = data.stProfileOfExpertEvaluatorsId;
        presentationEvaluatorsFeedback.isPresent = data.isPresent;
        presentationEvaluatorsFeedback.evaluatorFeedback = data.evaluatorFeedback;
        presentationEvaluatorsFeedback.pageNo1 = data.pageNo1;
        presentationEvaluatorsFeedback.researcherFeedback = data.researcherFeedback;
        presentationEvaluatorsFeedback.pageNo2 = data.pageNo2;
        presentationEvaluatorsFeedback.feedbackCompleted = data.feedbackCompleted;
        presentationEvaluatorsFeedback.isResearcherVisible = data.isResearcherVisible;
        presentationEvaluatorsFeedback.isNew = data.isNew;
        presentationEvaluatorsFeedback.isEditable = data.isEditable;
        presentationEvaluatorsFeedback.type = 'Evaluator';

        this.editFeedback(presentationEvaluatorsFeedback);
    }


    onEditResearcherFeedback(data: any) {
        const presentationEvaluatorsFeedback = new PresentationEvaluatorsFeedback();
        presentationEvaluatorsFeedback.id = data.id;
        presentationEvaluatorsFeedback.uuid = data.uuid;
        presentationEvaluatorsFeedback.m2ResearcherPresentationId = data.researcherPresentation.id;
        presentationEvaluatorsFeedback.m1ResearcherProposalId = data.researcherProposal.id;
        presentationEvaluatorsFeedback.stProfileOfExpertEvaluatorsId = data.stProfileOfExpertEvaluatorsId;
        presentationEvaluatorsFeedback.m2AddNewMemberId = data.stProfileOfExpertEvaluatorsId;
        presentationEvaluatorsFeedback.isPresent = data.isPresent;
        presentationEvaluatorsFeedback.evaluatorFeedback = data.evaluatorFeedback;
        presentationEvaluatorsFeedback.pageNo1 = data.pageNo1;
        presentationEvaluatorsFeedback.researcherFeedback = data.researcherFeedback;
        presentationEvaluatorsFeedback.pageNo2 = data.pageNo2;
        presentationEvaluatorsFeedback.feedbackCompleted = data.feedbackCompleted;
        presentationEvaluatorsFeedback.isResearcherVisible = data.isResearcherVisible;
        presentationEvaluatorsFeedback.isNew = data.isNew;
        presentationEvaluatorsFeedback.isEditable = data.isEditable;
        presentationEvaluatorsFeedback.type = 'Researcher';

        this.editFeedback(presentationEvaluatorsFeedback);
    }


    editFeedback(presentationEvaluatorsFeedback: PresentationEvaluatorsFeedback) {

        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = false;
        dialogConfig.width = '60%';
        dialogConfig.height = 'auto';
        dialogConfig.data = {...presentationEvaluatorsFeedback};

        const dialogRef = this._dialog.open(FeedbackEditModalComponent, dialogConfig);
        dialogRef.componentInstance.closeEventEmitter.subscribe(res => {
            if (res) {
                dialogRef.close(true);
                this.findAllByResearcherProposalId();
            }
        });
    }


    onChangeFeedbackCompleted(event: any, data: any, index: number) {

        const presentationEvaluatorsFeedback = new PresentationEvaluatorsFeedback();
        presentationEvaluatorsFeedback.id = data.id;
        presentationEvaluatorsFeedback.uuid = data.uuid;
        presentationEvaluatorsFeedback.m2ResearcherPresentationId = data.researcherPresentation.id;
        presentationEvaluatorsFeedback.m1ResearcherProposalId = data.researcherProposal.id;
        presentationEvaluatorsFeedback.stProfileOfExpertEvaluatorsId = data.stProfileOfExpertEvaluatorsId;
        presentationEvaluatorsFeedback.m2AddNewMemberId = data.stProfileOfExpertEvaluatorsId;
        presentationEvaluatorsFeedback.isPresent = data.isPresent;
        presentationEvaluatorsFeedback.evaluatorFeedback = data.evaluatorFeedback;
        presentationEvaluatorsFeedback.pageNo1 = data.pageNo1;
        presentationEvaluatorsFeedback.researcherFeedback = data.researcherFeedback;
        presentationEvaluatorsFeedback.pageNo2 = data.pageNo2;
        presentationEvaluatorsFeedback.feedbackCompleted = event.checked;
        presentationEvaluatorsFeedback.isResearcherVisible = data.isResearcherVisible;
        presentationEvaluatorsFeedback.isNew = data.isNew;
        presentationEvaluatorsFeedback.isEditable = data.isEditable;
        presentationEvaluatorsFeedback.type = data.type;

        this.onSubmit(presentationEvaluatorsFeedback, index);
    }


    onSubmit(presentationEvaluatorsFeedback: PresentationEvaluatorsFeedback, index: number) {
        this.saveDisable = true;
        this.spinner = true;
        this.service.update(presentationEvaluatorsFeedback).subscribe(res => {
                if (res.success) {
                    this.feedbackList[index].checked = res.obj.checked;
                    this._snackbarHelper.openSuccessSnackBarWithMessage(SUCCESSFULLY_SAVE, OK);
                } else {
                    this._snackbarHelper.openErrorSnackBarWithMessage(res.message, ERROR);

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

    delete(item: any) {
    }

    goPrevious() {
        this.router.navigate(['feedback-list-page']);
    }


    findUserByUserId(userId: number) {
        this.spinner = true;
        this._feedbackBetweenEvaluatorAndResearcherService.findUserByUserId(userId).subscribe(
            response => {
                this.spinner = false;
                if (response.success && response.obj) {
                    this.evaluatorUserList = [{user: {...response.obj}}];
                }
            },
            error => {
                console.log('error ==== >>>>> ', error);
                this.spinner = false;
            }
        );
    }


    // findEvaluatorBySeminarId(userId: number) {
    //   this.spinner = true;
    //   this._feedbackBetweenEvaluatorAndResearcherService.findEvaluatorBySeminarId(userId).subscribe(
    //     response => {
    //       this.spinner = false;
    //       if (response.success && response.items) {
    //         this.evaluatorUserList = response.items;
    //       }
    //     },
    //     error => {
    //       console.log('error ==== >>>>> ', error);
    //       this.spinner = false;
    //     }
    //   );
    // }


    findEvaluatorByResearcherProposalId(researcherProposalId: number) {
        this.spinner = true;
        this._feedbackBetweenEvaluatorAndResearcherService.findEvaluatorByResearcherProposal(researcherProposalId).subscribe(
            response => {
                this.spinner = false;
                if (response.success && response.obj) {
                    this.evaluatorUserList = [response.obj];
                    console.log('evaluatorUserList === >>>> ', this.evaluatorUserList);
                }
            },
            error => {
                console.log('error ==== >>>>> ', error);
                this.spinner = false;
            }
        );
    }

    sendMail() {
        this.spinner = true;
        this.feedback.isSent = true;
        this._feedbackBetweenEvaluatorAndResearcherService.update(this.feedback).subscribe(
            response => {
                if (response.success) {
                    this._snackbarHelper.openSuccessSnackBarWithMessage("Successfully Send", OK);
                } else {
                    this._snackbarHelper.openErrorSnackBarWithMessage(response.message, ERROR);
                }
                this.spinner = false;
            },
            error => {
                console.log('error ==== >>>> ', error);
                this._snackbarHelper.openErrorSnackBarWithMessage('HTTP error occurred!.', ERROR);
                this.spinner = false;
            }
        );
    }
}
