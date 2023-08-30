import {Component, OnInit} from '@angular/core';
import {UnsubscribeAdapterComponent} from "../../../../../../core/helper/unsubscribeAdapter";
import {FuseTranslationLoaderService} from "../../../../../../core/services/translation-loader.service";
import {PresentationEvaluatorsFeedbackService} from "../../../../services/presentation-evaluators-feedback.service";
import {ActivatedRoute, Router} from "@angular/router";
import {SnackbarHelper} from "../../../../../../core/helper/snackbar.helper";
import {locale as lngEnglish} from "./i18n/en";
import {locale as lngBangla} from "./i18n/bn";
import {previousIcon, saveIcon} from '../../../../constants/button.constants';
import {PresentationEvaluatorsFeedback} from "../../../../models/PresentationEvaluatorsFeedback";
import {ERROR, OK, SUCCESSFULLY_SAVE} from "../../../../../../core/constants/message";
import {EvaluatorNewMemberAttendance} from "../../../../models/EvaluatorNewMemberAttendance";
import {EvaluatorNewmemberAttendanceService} from "../../../../services/evaluator-newmember-attendance.service";
import {MIN_EDITOR_CONFIG} from "../../../../../../core/constants/editor-config";

@Component({
    selector: 'app-evaluator-feedback',
    templateUrl: './evaluator-feedback.component.html',
    styleUrls: ['./evaluator-feedback.component.scss']
})
export class EvaluatorFeedbackComponent extends UnsubscribeAdapterComponent implements OnInit {

    spinner = true;
    attendanceUuid: string;
    attendance: EvaluatorNewMemberAttendance = new EvaluatorNewMemberAttendance();
    feedback: PresentationEvaluatorsFeedback = new PresentationEvaluatorsFeedback();
    saveDisable: boolean = true;
    saveIcon = saveIcon;
    previousIcon = previousIcon;
    mediumEditorConfig: any = MIN_EDITOR_CONFIG;

    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
                private service: PresentationEvaluatorsFeedbackService,
                private attendanceService: EvaluatorNewmemberAttendanceService,
                private activatedRoute: ActivatedRoute,
                private router: Router,
                private snackbarHelper: SnackbarHelper) {
        super();
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

    ngOnInit(): void {
        this.activatedRoute.params.subscribe(params => {
            this.attendanceUuid = params['attendanceUuid'];
            this.getAttendanceByUuid();
        });
    }

    private getAttendanceByUuid() {
        this.spinner = true;
        this.subscribe$.add(
            this.attendanceService.getByUuid(this.attendanceUuid).subscribe(res => {
                if (res.success && res.obj) {
                    this.attendance = res.obj;
                }
                this.spinner = false;
            })
        );
    }

    onSubmit() {
        this.feedback.stProfileOfExpertEvaluatorsId = this.attendance.stProfileOfExpertEvaluatorsId;
        this.feedback.m2AddNewMemberId = this.attendance.m2AddNewMemberId;
        this.feedback.m2ResearcherPresentationId = this.attendance.m2ResearcherPresentationId;
        this.feedback.m1ResearcherProposalId = this.attendance.m1ResearcherProposalId;
        this.saveDisable = true;
        this.spinner = true;
        this.service.create(this.feedback).subscribe(res => {
                if (res.success) {
                    this.feedback = res.obj;
                    this.snackbarHelper.openSuccessSnackBarWithMessage(SUCCESSFULLY_SAVE, OK);
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

    previousTab() {
        this.router.navigate(['start-presentation/' + this.attendance.researcherPresentationResponseDto.uuid]);
    }

    seePreviousFeedback() {
        this.router.navigate(['evaluator-feedback-list/' + this.attendance.uuid]);
    }

    checkValidation() {
        this.saveDisable = !(this.feedback.evaluatorFeedback && this.feedback.pageNo1 && this.feedback.pageNo1 > 0);
    }
}
