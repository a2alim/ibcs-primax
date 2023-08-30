import { Component, OnInit } from '@angular/core';
import {
    previousIcon,
    downloadIcon,
    printIcon,
    pdfIcon,
} from 'app/main/modules/rpm/constants/button.constants';
import { MatTableDataSource } from '@angular/material/table';
import { environment, reportBackend } from 'environments/environment';
import { FuseTranslationLoaderService } from 'app/main/core/services/translation-loader.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'app/main/modules/auth/services/auth.service';
import { ChequeCollectionService } from 'app/main/modules/training-institute/services/cheque-collection.service';
import { locale as lngEnglish } from '../i18n/en';
import { locale as lngBangla } from '../i18n/bn';
import { CompletionReportService } from '../../../../services/completion-report.service';
import { CourseService } from '../../../../services/course.service';
import { TrainersService } from 'app/main/modules/training-institute/services/trainers.service';
import { ParticipantService } from 'app/main/modules/training-institute/services/participant.service';
import * as bl2Js from 'bl2-js-report';
@Component({
    selector: 'app-completion-report-view',
    templateUrl: './completion-report-view.component.html',
    styleUrls: ['./completion-report-view.component.scss'],
})
export class CompletionReportViewComponent implements OnInit {
    spinner: boolean = false;
    spinner1: boolean = false;
    spinner2: boolean = false;
    spinner3: boolean = false;
    spinner4: boolean = false;
    spinner5: boolean = false;
    spinner6: boolean = false;

    displayedColumns: string[] = [
        'sl',
        'instituteName',
        'collectionDate',
        'receivedAmount',
        'mobileNo',
        'isChequeReceived',
        'signaturedDocument',
        'action',
    ];
    dataSource: MatTableDataSource<any>;

    /*----Button---*/
    previousIcon = previousIcon;
    downloadIcon = downloadIcon;
    printIcon = printIcon;
    pdfIcon = pdfIcon;
    /*----/Button---*/

    fiscalYears: any[] = [];
    trainingInstitutes: any[] = [];
    trainerList: any[] = [];
    participantList: any[] = [];

    completionList: any;
    userType: string = this._authService.getLoggedUserType();
    // the model
    comp: any;

    proposalId: number;
    courseScheduleList: any = [];

    tempChequeId: string;
    chequeId: number;
    minioFileDownloadEndPointHost: string =
        environment.ibcs.minioFileDownloadEndPointHost;
    completionId: number;
    speStr: string;
    data: any[] = [];

    courseList: {
        session: string;
        topic: string;
        speakers: string;
        date: string;
        day: string;
        time: string;
    }[] = [];

    constructor(
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private route: Router,
        private _authService: AuthService,
        private activateRoute: ActivatedRoute,
        private _completionReportService: CompletionReportService,
        private _courseSchedule: CourseService,
        private _activatedRoute: ActivatedRoute,
        private _trainersService: TrainersService,
        private _participantService: ParticipantService
    ) {
        this._fuseTranslationLoaderService.loadTranslations(
            lngEnglish,
            lngBangla
        );
    }

    ngOnInit(): void {
        this.spinner = true;

        this.completionId = Number(
            this.activateRoute.snapshot.paramMap.get('id')
        );
        this.proposalId = Number(
            this._activatedRoute.snapshot.paramMap.get('id')
        );

        this.getList((res) => {
            if (res) {
                this.getCourseScheduleByProposalId();
                this.getTrainerList();
                this.getParticipantsByProposalId();
            }
        });

        // this.getCourseScheduleByProposalId();
        // this.getTrainerList();
        this.getAllCompletion();
        this.getCompletionList();
        //this.getCourseSchedule();
    }

    getList(callBack) {
        this.spinner = true;
        this._completionReportService.getById(this.completionId).subscribe(
            (res) => {
                this.comp = res;
                this.comp.proposalModel.id;
                callBack(this.comp.proposalModel.id);
                this.spinner = false;
            },
            (error) => {
                this.spinner = false;
                callBack(null);
            }
        );
    }

    getCourseSchedule() {
        this._courseSchedule.getCourseByProposalId(this.proposalId).subscribe(
            (res) => {
                this.courseScheduleList = res;
                console.log('courseList', this.courseScheduleList);
            },
            (error) => {
                console.log('error');
            }
        );
    }

    getCourseScheduleByProposalId() {
        this.spinner1 = true;
        this._courseSchedule
            .getCourseSchedule(this.comp.proposalModel.id)
            .subscribe(
                (res) => {
                    if (res.success) {
                        this.courseScheduleList = res.items ? res.items : [];
                    }
                    this.spinner1 = false;
                },
                (error) => {
                    console.log('error');
                    this.spinner1 = false;
                }
            );
    }

    viewDetails(id: number) {
        this.route.navigate(['cheque-collection/view/' + id]);
    }

    edit(id: number) {
        this.route.navigate(['cheque-collection/edit/' + id]);
    }

    download($fileName = '') {
        // this.courseScheduleList;

        if (this.courseScheduleList) {
            this.courseScheduleList.forEach((element) => {
                if (element.speakers) {
                    let speStr = this.getSpeakers(element.speakers);
                    element.speStr = speStr;
                } else {
                    element.speStr = '';
                }
            });
        } else {
        }

        console.log('courseScheduleList ----- >>> ', this.courseScheduleList);

        this.data['fileName'] = $fileName;
        this.data['templateName'] = 'ti-reports/completionReport';
        this.data['lng'] = localStorage.getItem('currentLang');

        this.data['comp'] = JSON.stringify(this.comp);
        this.data['trainerList'] = JSON.stringify(this.trainerList);
        this.data['participantList'] = JSON.stringify(this.participantList);
        this.data['courseScheduleList'] = JSON.stringify(
            this.courseScheduleList
        );

        //Optional
        this.data['view'] = 0; // 0 = false or 1 = true
        this.data['print_r'] = 0; // 0 = false or 1 = true
        let actionUrl = `${reportBackend}/pdf-generate-post`;
        bl2Js(this.data, actionUrl);
    }

    print() {
        window.print();
    }

    getCompletionList() {
        this._completionReportService.getById(this.completionId).subscribe(
            (res) => {
                console.log('comp', res);
                this.comp = res;
            },
            (error) => {}
        );
        this.spinner = false;
    }

    getAllCompletion() {
        this._completionReportService.getList(0, 5).subscribe(
            (res) => {
                res.data.forEach((f) => {
                    this.completionList = f;
                });
                console.log('completion', this.completionList);
            },
            (error) => {
                console.log('error');
            }
        );
    }

    getSpeakers(speakers: any) {
        let trainers: string[] = [];
        speakers.map((speaker) => {
            if (speaker.name) trainers.push(speaker.name);
        });

        let text = '';
        trainers.forEach((data) => {
            text += data + ' , ';
        });
        return text;
    }

    getTrainerList() {
        this.spinner2 = true;
        this._trainersService
            .getByProposalId(this.comp.proposalModel.id)
            .subscribe(
                (response) => {
                    this.trainerList = response.items ? response.items : [];
                    this.spinner2 = false;
                },
                (error) => {
                    console.log(error);
                    this.spinner2 = false;
                }
            );
    }

    getParticipantsByProposalId() {
        this.spinner3 = true;
        this._participantService
            .getParticipantsByProposalId(this.comp.proposalModel.id)
            .subscribe(
                (response) => {
                    this.participantList = response;
                    this.spinner3 = false;
                },
                (error) => {
                    this.spinner3 = false;
                }
            );
    }
}
