import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges
} from '@angular/core';
import { MIN_EDITOR_CONFIG } from 'app/main/core/constants/editor-config';
import {
    addNewIcon,
    nextIcon,
    previousIcon,
    refreshIcon,
    saveIcon
} from 'app/main/modules/rpm/constants/button.constants';
import { ResearcherProposal } from 'app/main/modules/rpm/models/ResearcherProposal';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import { SnackbarHelper } from '../../../../../../../core/helper/snackbar.helper';
import { UnsubscribeAdapterComponent } from '../../../../../../../core/helper/unsubscribeAdapter';
import { FuseTranslationLoaderService } from '../../../../../../../core/services/translation-loader.service';
import { ResearcherProposalInformation } from '../../../../../models/ResearcherProposalInformation';
import { ResearcherProposalInfoService } from '../../../../../services/researcher-proposal-info.service';
import { locale as lngBangla } from './i18n/bn';
import { locale as lngEnglish } from './i18n/en';
@Component({
    selector: 'app-researcher-proposal-info',
    templateUrl: './researcher-proposal-info.component.html',
    styleUrls: ['./researcher-proposal-info.component.scss'],
})
export class ResearcherProposalInfoComponent
    extends UnsubscribeAdapterComponent
    implements OnInit, OnChanges
{
    proposalInfo: ResearcherProposalInformation =
        new ResearcherProposalInformation();
    @Input() existingProposalInfo: ResearcherProposal;
    @Input() brodCastChange: BehaviorSubject<any>;
    @Output() nextStep = new EventEmitter<boolean>();
    @Output() backPrevious = new EventEmitter<boolean>();
    mediumEditorConfig: any = MIN_EDITOR_CONFIG;
    config: {
        timeOut: 5000;
        closeButton: true;
        positionClass: 'toast-top-right';
        enableHtml: true;
    };
    existingProposalInfoId: number = 0;
    spinner = true;
    information: boolean = true;
    statementOfProblem: boolean = true;
    objectivesOfTheStudy: boolean = true;
    formulationResearch: boolean = true;
    conceptualFramework: boolean = true;
    reviewOfLiterature: boolean = true;
    rationaleOfTheStudy: boolean = true;
    scopeOfTheStudy: boolean = true;
    methodsOfTheStudy: boolean = true;
    expectedOutput: boolean = true;
    relationWithSocialPolicy: boolean = true;
    tentativeChapterization: boolean = true;
    actionPlanTentativeBudget: boolean = true;
    tentativeBudget: boolean = true;
    bibliographyReferences: boolean = true;
    additionalInfoTopicProposal: boolean = true;
    canSave: boolean = true;
    /*----Button---*/
    refreshIcon = refreshIcon;
    saveIcon = saveIcon;
    previousIcon = previousIcon;
    addNewIcon = addNewIcon;
    nextIcon = nextIcon;
    /*----/Button---*/
    constructor(
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private service: ResearcherProposalInfoService,
        private snackbarHelper: SnackbarHelper,
        private _toastrService: ToastrService
    ) {
        super();
        this._fuseTranslationLoaderService.loadTranslations(
            lngEnglish,
            lngBangla
        );
    }
    ngOnInit(): void {
        this.spinner = false;
    }
    ngOnChanges(changes: SimpleChanges) {
        for (const propName in changes) {
            if (changes.hasOwnProperty(propName)) {
                switch (propName) {
                    case 'existingProposalInfo': {
                        if (this.existingProposalInfo.id) {
                            this.canSave = true;
                            this.existingProposalInfoId =
                                this.existingProposalInfo.id;
                            this.getByResearcherProposalId(
                                this.existingProposalInfo.id
                            );
                        }
                        break;
                    }
                    case 'brodCastChange': {
                        this.brodCastChange.subscribe((res) => {
                            if (res && res.id) {
                                this.existingProposalInfoId = res.id;
                                this.canSave = true;
                                this.getByResearcherProposalId(res.id);
                            }
                        });
                        break;
                    }
                }
            }
        }
    }
    getByResearcherProposalId(id: number) {
        this.proposalInfo.researcherProposalId = id;
        this.subscribe$.add(
            this.service.getByResearcherProposalId(id).subscribe((res) => {
                if (res.success) {
                    this.proposalInfo = res.obj;
                }
            })
        );
    }
    onSubmit(next: boolean) {
        if (
            this.existingProposalInfoId < 1 ||
            this.existingProposalInfoId == null
        ) {
            this._toastrService.warning(
                'Submit the proposal information first!.',
                '',
                this.config
            );
            return;
        }
        if (!this.proposalInfo) {
            return;
        }
        if (
            !this.proposalInfo.introduction ||
            !this.proposalInfo.objectivesOfTheStudy ||
            !this.proposalInfo.formulationResearch ||
            !this.proposalInfo.conceptualFramework ||
            !this.proposalInfo.reviewOfLiterature ||
            !this.proposalInfo.rationaleOfTheStudy ||
            !this.proposalInfo.scopeOfTheStudy ||
            !this.proposalInfo.methodsOfTheStudy ||
            !this.proposalInfo.expectedOutput ||
            !this.proposalInfo.relationWithSocialPolicy ||
            !this.proposalInfo.tentativeChapterization ||
            !this.proposalInfo.actionPlanTentativeBudget ||
            !this.proposalInfo.bibliographyReferences ||
            !this.proposalInfo.additionalInfoTopicProposal ||
            !this.proposalInfo.tentativeBudget
        ) {
            this._toastrService.warning(
                'Please enter the required information !.',
                '',
                this.config
            );
            return;
        }
        this.canSave = false;
        if (
            this.proposalInfo.id === null ||
            this.proposalInfo.id === undefined
        ) {
            this.create(next);
        } else {
            this.update(next);
        }
    }
    private create(next: boolean) {
        this.spinner = true;
        this.subscribe$.add(
            this.service.create(this.proposalInfo).subscribe((res) => {
                if (res.success) {
                    this.snackbarHelper.openSuccessSnackBar();
                    this.spinner = false;
                    this.canSave = true;
                    this.proposalInfo = res.obj;
                    if (next) {
                        this.nextTab();
                    }
                } else {
                    this.snackbarHelper.openErrorSnackBar();
                    this.spinner = false;
                    this.canSave = true;
                }
            })
        );
    }
    private update(next: boolean) {
        this.spinner = true;
        this.subscribe$.add(
            this.service.update(this.proposalInfo).subscribe((res) => {
                if (res.success) {
                    this.snackbarHelper.openSuccessSnackBar();
                    //this.snackbarHelper.openSuccessSnackBarWithMessage(res.message,'OK');
                    this.spinner = false;
                    this.canSave = true;
                    this.proposalInfo = res.obj;
                    if (next) {
                        this.nextTab();
                    }
                } else {
                    this.snackbarHelper.openErrorSnackBar();
                    this.spinner = false;
                    this.canSave = true;
                }
            })
        );
    }
    uploadImageAsBase64(files: any, propertyName: string) {
        // this.utilsService.uploadImageAsBase64(this.form, files, propertyName);
    }
    nextTab() {
        this.nextStep.emit(true);
    }
    previousTab(): void {
        this.backPrevious.emit(true);
    }
    /**
     * For Expanding CK Editor
     * @param i
     */
    expandX(i: number): void {
        if (i === 1) {
            this.information = true;
        }
        if (i === 2) {
            this.objectivesOfTheStudy = true;
        }
        if (i === 3) {
            this.formulationResearch = true;
        }
        if (i === 4) {
            this.conceptualFramework = true;
        }
        if (i === 5) {
            this.reviewOfLiterature = true;
        }
        if (i === 6) {
            this.rationaleOfTheStudy = true;
        }
        if (i === 7) {
            this.scopeOfTheStudy = true;
        }
        if (i === 8) {
            this.methodsOfTheStudy = true;
        }
        if (i === 9) {
            this.expectedOutput = true;
        }
        if (i === 10) {
            this.relationWithSocialPolicy = true;
        }
        if (i === 11) {
            this.tentativeChapterization = true;
        }
        if (i === 12) {
            this.actionPlanTentativeBudget = true;
        }
        if (i === 13) {
            this.bibliographyReferences = true;
        }
        if (i === 14) {
            this.additionalInfoTopicProposal = true;
        }
        if (i === 15) {
            this.statementOfProblem = true;
        }
        if (i === 16) {
            this.tentativeBudget = true;
        }
    }
    /**
     * For Collapsing CK Editor
     * @param i
     */
    collapseX(i: number): void {
        if (i === 1) {
            this.information = false;
        }
        if (i === 2) {
            this.objectivesOfTheStudy = false;
        }
        if (i === 3) {
            this.formulationResearch = false;
        }
        if (i === 4) {
            this.conceptualFramework = false;
        }
        if (i === 5) {
            this.reviewOfLiterature = false;
        }
        if (i === 6) {
            this.rationaleOfTheStudy = false;
        }
        if (i === 7) {
            this.scopeOfTheStudy = false;
        }
        if (i === 8) {
            this.methodsOfTheStudy = false;
        }
        if (i === 9) {
            this.expectedOutput = false;
        }
        if (i === 10) {
            this.relationWithSocialPolicy = false;
        }
        if (i === 11) {
            this.tentativeChapterization = false;
        }
        if (i === 12) {
            this.actionPlanTentativeBudget = false;
        }
        if (i === 13) {
            this.bibliographyReferences = false;
        }
        if (i === 14) {
            this.additionalInfoTopicProposal = false;
        }
        if (i === 15) {
            this.statementOfProblem = false;
        }
        if (i === 16) {
            this.tentativeBudget = false;
        }
    }
    openClose(i: number, action): void {
        if (i === 1) {
            this.information = action;
        }
        if (i === 2) {
            this.objectivesOfTheStudy = action;
        }
        if (i === 3) {
            this.formulationResearch = action;
        }
        if (i === 4) {
            this.conceptualFramework = action;
        }
        if (i === 5) {
            this.reviewOfLiterature = action;
        }
        if (i === 6) {
            this.rationaleOfTheStudy = action;
        }
        if (i === 7) {
            this.scopeOfTheStudy = action;
        }
        if (i === 8) {
            this.methodsOfTheStudy = action;
        }
        if (i === 9) {
            this.expectedOutput = action;
        }
        if (i === 10) {
            this.relationWithSocialPolicy = action;
        }
        if (i === 11) {
            this.tentativeChapterization = action;
        }
        if (i === 12) {
            this.actionPlanTentativeBudget = action;
        }
        if (i === 13) {
            this.bibliographyReferences = action;
        }
        if (i === 14) {
            this.additionalInfoTopicProposal = action;
        }
        if (i === 15) {
            this.statementOfProblem = action;
        }
        if (i === 16) {
            this.tentativeBudget = action;
        }
    }
}
