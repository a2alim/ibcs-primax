import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FuseTranslationLoaderService} from "../../../../../../core/services/translation-loader.service";
import {PresentationEvaluatorsFeedbackService} from "../../../../services/presentation-evaluators-feedback.service";
import {locale as lngEnglish} from "./i18n/en";
import {locale as lngBangla} from "./i18n/bn";
import {
    addNewIcon,
    downloadIcon,
    noteIcon,
    previousIcon,
    printIcon
} from 'app/main/modules/rpm/constants/button.constants';
import {UnsubscribeAdapterComponent} from "../../../../../../core/helper/unsubscribeAdapter";
import {ResearcherProposalService} from "../../../../services/researcher-proposal.service";
import {ResearcherProposal} from "../../../../models/ResearcherProposal";
import {PresentationEvaluatorsFeedback} from "../../../../models/PresentationEvaluatorsFeedback";
import {EvaluatorNewmemberAttendanceService} from "../../../../services/evaluator-newmember-attendance.service";
import {EvaluatorNewMemberAttendance} from "../../../../models/EvaluatorNewMemberAttendance";

@Component({
    selector: 'app-evaluator-feedback-list',
    templateUrl: './evaluator-feedback-list.component.html',
    styleUrls: ['./evaluator-feedback-list.component.scss']
})
export class EvaluatorFeedbackListComponent extends UnsubscribeAdapterComponent implements OnInit {

    attendanceUuid: string;
    proposalUuid: string;
    presentationUuid: string;
    expertEvaluatorId: number;
    newMemberUuid: string;
    proposal: ResearcherProposal;
    attendance: EvaluatorNewMemberAttendance;
    spinner = false;

    /*----Button---*/
    previousIcon = previousIcon;
    downloadIcon = downloadIcon;
    printIcon = printIcon;
    noteIcon = noteIcon;
    // editIcon = editIcon;
    addNewIcon = addNewIcon;
    /*----/Button---*/

    feedbackList: PresentationEvaluatorsFeedback[] = [];
    evaluatorList: any[] = [];
    researchCategoryTypeList: any[] = [];
    fiscalYearList: any[] = [];
    documentTypeList: any[] = [];
    source: string;


    constructor(private activateRoute: ActivatedRoute,
                private _fuseTranslationLoaderService: FuseTranslationLoaderService,
                private service: PresentationEvaluatorsFeedbackService,
                private attendanceService: EvaluatorNewmemberAttendanceService,
                private researcherProposalService: ResearcherProposalService,
                private router: Router,
    ) {
        super();
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

    ngOnInit(): void {
        this.attendanceUuid = this.activateRoute.snapshot.paramMap.get('attendanceUuid');
        this.getAttendance();
    }

    getAttendance() {
        this.spinner = true;
        this.subscribe$.add(
            this.attendanceService.getByUuid(this.attendanceUuid).subscribe(res => {
                if (res.success && res.obj) {
                    this.attendance = res.obj;
                    this.getProposal();
                    this.getByResearcherPresentationIdAndProposalIdAndExpertEvaluatorOrNewMember();
                }
                this.spinner = false;
            })
        );
    }

    private getProposal() {
        this.spinner = true;
        this.subscribe$.add(
            this.researcherProposalService.getById(this.attendance.researcherProposalResponseDto.id).subscribe(res => {
                if (res.success && res.obj) {
                    this.proposal = res.obj;
                }
                this.spinner = false;
            })
        );
    }


    getByResearcherPresentationIdAndProposalIdAndExpertEvaluatorOrNewMember() {
        this.spinner = true;
        this.subscribe$.add(
            this.service.getByResearcherPresentationIdAndProposalIdAndExpertEvaluatorOrNewMember({
                m1ResearcherProposalUuid: this.attendance.researcherProposalResponseDto.uuid,
                m2ResearcherPresentationUuid: this.attendance.researcherPresentationResponseDto.uuid,
                m2AddNewMemberUuid: this.attendance.newMemberResponseDto?.uuid,
                stProfileOfExpertEvaluatorsId: this.attendance.stProfileOfExpertEvaluatorsId
            }).subscribe(res => {
                    if (res.success && res.items) {
                        this.feedbackList = res.items ? res.items : [];
                    }
                    this.spinner = false;
                }
            )
        )
    }

    goPrevious() {
        this.router.navigate(['evaluator-feedback/' + this.attendanceUuid]);
    }


    
}
