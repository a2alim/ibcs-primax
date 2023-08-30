import { Component, OnInit } from '@angular/core';
import { locale as lngEnglish } from "./i18n/en";
import { locale as lngBangla } from "./i18n/bn";
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { FuseTranslationLoaderService } from 'app/main/core/services/translation-loader.service';
import { addNewIcon, nextIcon, previousIcon, refreshIcon, saveIcon } from 'app/main/modules/rpm/constants/button.constants';
import { ToastrService } from 'ngx-toastr';
import { TrainersAcademicBackgroundListModel } from '../../../models/trainers-academic-background-list.model';
import { TrainersModel } from '../../../models/trainers.model';
import { SpeakerEvaluationService } from '../../../services/speaker-evaluation.service';
import { CourseService } from '../../../services/course.service';
import { CourseResponse } from '../../../models/course-response.model';
import { DEFAULT_PAGE, DEFAULT_SIZE } from 'app/main/core/constants/constant';
import { SpeakerEvaluationModel, SpeakerEvaluationModelNew, SpeakerEvaluationQuestionModel } from '../../../models/speaker-evaluation.model';
import { ProposalService } from "../../../services/proposal.service";
import { CookieService } from "ngx-cookie-service";
import { ParticipantAttendanceService } from '../../../services/participant-attendance.service';
import { CommonTypeService } from 'app/main/modules/settings/services/common-type.service';

@Component({
    selector: 'app-speaker-evaluation',
    templateUrl: './speaker-evaluation.component.html',
    styleUrls: ['./speaker-evaluation.component.scss']
})
export class SpeakerEvaluationComponent implements OnInit {

    //Icon
    refreshIcon = refreshIcon;
    saveIcon = saveIcon;
    previousIcon = previousIcon;
    addNewIcon = addNewIcon;
    nextIcon = nextIcon;
    questions: any[];

    questionModels: SpeakerEvaluationQuestionModel[] = new Array<SpeakerEvaluationQuestionModel>();
    //Toast Config
    config: { timeOut: 5000; closeButton: true; positionClass: 'toast-top-right'; enableHtml: true; };
    displayedColumns: string[] = ['sl', 'subject', 'examination', 'result', 'passing_year', 'institution', 'board', 'action'];
    dataSource: MatTableDataSource<CourseResponse>;
    ratings: { data: string, value: number }[] = [
        {
            data: "Good",
            value: 1
        },
        {
            data: "Very Good",
            value: 2
        },
        {
            data: "Excellent",
            value: 3
        },

    ];

    //Variable
    trainersModel: TrainersModel = new TrainersModel();
    trainersAcademicBackgroundModel: TrainersAcademicBackgroundListModel = new TrainersAcademicBackgroundListModel();
    isUpdatedAction: boolean;
    total: number;
    size: number = DEFAULT_SIZE;
    page: number = DEFAULT_PAGE;
    speakerEvaluationModel: SpeakerEvaluationModelNew = new SpeakerEvaluationModelNew();

    //response data
    sessionList: any[] = [];
    courseList: any[] = [];
    questionList: any[] = [];
    speakers: any[] = [];
    speakerList: any[] = [];

    private participantId: number;

    spinner: Boolean;
    spinner1: Boolean;
    spinner2: Boolean;
    spinner3: Boolean;
    spinner4: Boolean;
    spinner5: Boolean;

    constructor(
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _toastrService: ToastrService,
        private _speakerEvaluationService: SpeakerEvaluationService,
        private _proposalService: ProposalService,
        private _cookieService: CookieService,
        private _participantAttendanceService: ParticipantAttendanceService,
        private _commonTypeService: CommonTypeService,) {
        // Language translations
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

    ngOnInit(): void {
        this.getProposals();
        this.getQuestions();
        this.getSessionByParticipantId();
    }

    getProposals() {
        this.participantId = Number(this._cookieService.get('participantId'));
        this.spinner = true;
        this._proposalService.getProposalsByParticipantId(Number(this.participantId)).subscribe(
            res => {
                this.courseList = res;
                this.spinner = false;
            },
            err => {
                console.log(err);
                this.spinner = false;
            }
        )
    }

    submit() {
        this.onSave();
    }

    private getQuestions() {
        this.spinner2 = true;
        this._commonTypeService.findAllByActiveData(12).subscribe(
            res => {
                this.questionList = res ? res : [];
                this.questionList = this.questionList.map(m => {
                    m.answer = 1;
                    return m;
                });
                this.spinner2 = false;
            },
            error => {
                console.log(error);
                this.spinner2 = false;
            }
        )
    }


    getSessionByParticipantId() {
        this.spinner3 = true;
        this._participantAttendanceService.getAttendanceByParticipantId(this.participantId).subscribe(
            response => {
                console.log(response, 'response ');
                this.spinner3 = false;
                this.sessionList = response;
            },
            error => {
                console.log(' error ', error);
                this.spinner3 = false;
            }
        );
    }


    onSelectSession(getVal) {
        let f = this.sessionList.find(f => f.courseScheduleModel.id === getVal);
        this.speakerList = f.courseScheduleModel.speakers;
    }

    onSave() {
        this.speakerEvaluationModel.participantId = this.participantId;
        this.speakerEvaluationModel.tiSelectAnswerRequestDto = this.questionList.map(m => { m.stCommonTypeId = m.id; m.id = null; m.uuid = null; return m });
        this.spinner4 = true;
        this._speakerEvaluationService.createEvaluation(this.speakerEvaluationModel).subscribe(
            response => {
                console.log('response ----- >>>>> ', response);
                if (response.success) {
                    this._toastrService.success("Evaluation Submitted", "Success");
                    this.spinner4 = false;
                    this.formReset();
                } else {
                    this._toastrService.error(response.message, "Error");
                    this.spinner4 = false;
                    this.formReset();
                }
            },
            error => {
                console.log('error ----- >>>>> ', error);
                this._toastrService.error("Something went wrong", "Error");
                this.spinner4 = false;
                this.formReset();
            }
        );
    }

    formReset() {
        this.speakerEvaluationModel = new SpeakerEvaluationModelNew();
        this.getQuestions();
    }
}
