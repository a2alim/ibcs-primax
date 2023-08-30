import {Component, EventEmitter, Inject, OnInit} from '@angular/core';
import {CommentsService} from '../../../services/comments.service';
import {FuseTranslationLoaderService} from '../../../../../core/services/translation-loader.service';
import {locale as lngEnglish} from './i18n/en';
import {locale as lngBangla} from './i18n/bn';
import {IComments} from '../../../models/comments';
import {MAT_DIALOG_DATA, MatDialogConfig} from '@angular/material/dialog';
import {UnsubscribeAdapterComponent} from '../../../../../core/helper/unsubscribeAdapter';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {SnackbarHelper} from '../../../../../core/helper/snackbar.helper';
import {IProjectConcept} from "../../../models/project-concept";
import {UserGroupService} from "../../../../configuration-management/services/user-group.service";
import {UserGroup} from "../../../../../shared/enum/user-group.enum";
import {
    SUCCESSFULLY_SAVE,
    SUCCESSFULLY_SAVE_BN,
    SUCCESSFULLY_UPDATED,
    SUCCESSFULLY_UPDATED_BN
} from "../../../../../core/constants/message";
import {NumberPipe} from "../../../../../shared/pipes/number-pipe.pipe";
import {TranslateService} from "@ngx-translate/core";
import {ProjectMovementStageConstant} from "../../../../dpp-tapp-management/constants/project-movement-stage-constant";
import {DatePipe} from "@angular/common";

@Component({
    selector: 'app-comment-observation',
    templateUrl: './comment-observation.component.html',
    styleUrls: ['./comment-observation.component.scss']
})
export class CommentObservationComponent extends UnsubscribeAdapterComponent implements OnInit {

    closeEventEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();
    observer: string;
    comments: IComments[] = [];
    form: FormGroup;
    projectConcept: IProjectConcept;
    userGroup: string;
    addComments: boolean;
    sourceId: number;
    source: string;
    isEnLabel: boolean;
    forwardProjectButtonEnable: boolean;
    projectStage: string;
    isUnapproved: boolean;

    constructor(@Inject(MAT_DIALOG_DATA) data: any,
                private _fuseTranslationLoaderService: FuseTranslationLoaderService,
                private service: CommentsService,
                public numberPipe: NumberPipe,
                public datePipe: DatePipe,
                private _translateService: TranslateService,
                private snackbarHelper: SnackbarHelper) {
        super();
        this.sourceId = data.sourceId;
        this.source = data.source;
        this.projectStage = data.projectStage;
        // this.projectConcept = data.projectConcept;
        this.observer = (data.commission === 'A') ? 'Agency' : (data.commission === 'MD') ? 'Ministry Division' : (data.commission === 'PC') ? 'Planning Commission' : (data.commission === 'PM') ? 'Planning Minister' : 'Ecnec';
        this.userGroup = data.userGroup;
        this.isUnapproved = data.isUnapproved;
        if(data?.forward) {
            this.forwardProjectButtonEnable = true;
        }
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

    ngOnInit(): void {
        this.populateForm();
        this.matchUserGroup();
        this.getComments();
    }

    matchUserGroup() {
        if ((UserGroup.AGENCY_HEAD === this.userGroup || UserGroup.AGENCY_DESK === this.userGroup) && this.observer === 'Agency' &&
            (this.projectStage === ProjectMovementStageConstant.AGENCY_DESK || this.projectStage === ProjectMovementStageConstant.AGENCY_HEAD
                || this.projectStage === ProjectMovementStageConstant.ATTACH_POTRO_JARI)) {
            this.addComments = true;
        }
        if ((UserGroup.MINISTRY_DESK === this.userGroup || UserGroup.MINISTRY_HEAD === this.userGroup) && this.observer === 'Ministry Division' &&
            (this.projectStage === ProjectMovementStageConstant.MINISTRY_DESK || this.projectStage === ProjectMovementStageConstant.MINISTRY_HEAD
            || this.projectStage === ProjectMovementStageConstant.PROJECT_SCRUTINY_COMMITTEE_MEETING_NOTICE || this.projectStage === ProjectMovementStageConstant.PROJECT_SCRUTINY_COMMITTEE_MEETING_HELD
            || this.projectStage === ProjectMovementStageConstant.DPEC_MEETING_NOTICE || this.projectStage === ProjectMovementStageConstant.DPEC_MEETING_HELD
            || this.projectStage === ProjectMovementStageConstant.DSPEC_MEETING_NOTICE || this.projectStage === ProjectMovementStageConstant.DSPEC_MEETING_HELD)) {
            this.addComments = true;
        }
        if ((UserGroup.PLANNING_DESK === this.userGroup ||  UserGroup.PLANNING_HEAD === this.userGroup) && this.observer === 'Planning Commission' &&
            (this.projectStage === ProjectMovementStageConstant.PLANNING_COMMISSION_DESK || this.projectStage === ProjectMovementStageConstant.PLANNING_COMMISSION_HEAD
            || this.projectStage === ProjectMovementStageConstant.PEC_MEETING_NOTICE || this.projectStage === ProjectMovementStageConstant.PEC_MEETING_HELD
            || this.projectStage === ProjectMovementStageConstant.ECNEC_CONDITIONAL_APPROVE || this.projectStage === ProjectMovementStageConstant.UNAPPROVED_BY_ECNEC
            || this.projectStage === ProjectMovementStageConstant.SPEC_MEETING_NOTICE || this.projectStage === ProjectMovementStageConstant.SPEC_MEETING_HELD)) {
            this.addComments = true;
        }
        if (UserGroup.PLANNING_MINISTER === this.userGroup && this.observer === 'Planning Minister' && this.projectStage === ProjectMovementStageConstant.PLANNING_MINISTER) {
            this.addComments = true;
        }
        if((UserGroup.ECNEC === this.userGroup || UserGroup.ECNEC_DESK === this.userGroup || UserGroup.ECNEC_OFFICER === this.userGroup) && this.observer === 'Ecnec'
            && (this.projectStage === ProjectMovementStageConstant.IN_ECNEC || this.projectStage === ProjectMovementStageConstant.ECNEC_DESK || this.projectStage === ProjectMovementStageConstant.ECNEC_OFFICERS)) {
            this.addComments = true;
        }
    }

    private populateForm() {
        this.form = new FormGroup({
            sourceId: new FormControl(this.sourceId, [Validators.required]),
            commentsSource: new FormControl(this.source, [Validators.required]),
            comment: new FormControl('', [Validators.required]),
            observer: new FormControl(this.observer, [Validators.required]),
            id: new FormControl(0),
            uuid: new FormControl('')
        });
    }

    private getComments() {
        this.isEnLabel = this._translateService.currentLang === 'en';
        this.subscribe$.add(
            this.service.getCommentsByObserver({sourceId: this.sourceId, source: this.source, observer: this.observer}).subscribe(res => {
                this.comments = res;
                // this.form.patchValue({comment: ''});
                this.populateForm();
            })
        );
    }

    save() {
        this.closeEventEmitter.emit(true);
        if (this.form.get('id').value) {
            this.subscribe$.add(
                this.service.update(this.form.value).subscribe(res => {
                    if (res) {
                        this.snackbarHelper.openSuccessSnackBarWithMessageEnBn(SUCCESSFULLY_UPDATED, SUCCESSFULLY_UPDATED_BN);
                        this.getComments();
                    } else {
                        this.snackbarHelper.openErrorSnackBar();
                    }
                })
            );
        } else {
            this.subscribe$.add(
                this.service.create(this.form.value).subscribe(res => {
                    if (res) {
                        this.snackbarHelper.openSuccessSnackBarWithMessageEnBn(SUCCESSFULLY_SAVE, SUCCESSFULLY_SAVE_BN);
                        this.getComments();
                    } else {
                        this.snackbarHelper.openErrorSnackBar();
                    }
                })
            );
        }
    }


    forwardProject() {
        this.closeEventEmitter.emit(true);
    }

    editComment(comment: any) {
        this.form.patchValue(comment);
    }
}
