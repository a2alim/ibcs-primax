import {Component, OnInit} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {FuseTranslationLoaderService} from 'app/main/core/services/translation-loader.service';
import {
    ParticipantAttendanceService
} from 'app/main/modules/training-institute/services/participant-attendance.service';
import {ParticipantService} from 'app/main/modules/training-institute/services/participant.service';
import {ToastrService} from 'ngx-toastr';
import {locale as lngEnglish} from "../i18n/en";
import {locale as lngBangla} from "../i18n/bn";
import {
    previousIcon,
    refreshIcon,
    saveFailed,
    saveIcon,
    saveSuccess,
    updateFailed,
    updateSuccess
} from 'app/main/modules/rpm/constants/button.constants';
import {ActivatedRoute, Router} from '@angular/router';
import {CourseService} from "../../../../services/course.service";
import {ParticipantModel} from "../../../../models/participant.model";
import {ProposalModel} from "../../../../models/proposal.model";
import {ProposalService} from "../../../../services/proposal.service";
import {AttendanceResponse, ParticipantAttendanceModel, Trainer} from "../../../../models/attendance-response.model";
import {DateAdapter} from '@angular/material/core';
import {FileUploadService} from "../../../../../../shared/services/file-upload.service";
import {UtilsService} from "../../../../services/utils.service";


@Component({
    selector: 'app-attendance-form',
    templateUrl: './attendance-form.component.html',
    styleUrls: ['./attendance-form.component.scss']
})
export class AttendanceFormComponent implements OnInit {


    //Toast Config
    config: { timeOut: 5000; closeButton: true; positionClass: 'toast-top-right'; enableHtml: true; };

    displayedColumns: string[] = ['sl', 'participantName', 'phoneNo', 'present', 'speakerComment'];
    dataSource: MatTableDataSource<ParticipantAttendanceModel>;

    saveIcon = saveIcon;
    refreshIcon = refreshIcon;
    previousIcon = previousIcon;

    //Variable
    isEditable: boolean = false;
    participantAttendanceModels: ParticipantAttendanceModel[] = [];

    attendanceResponse: AttendanceResponse = new AttendanceResponse();

    isUpdatedAction: boolean;

    proposalModels: ProposalModel[] = [];
    // courseModel: any = {courseScheduleModels: []};
    courseModel: any;

    attendanceId: number;
    tempAttendanceId: String;

    saveSuccess = saveSuccess;
    saveFailed = saveFailed;
    updateSuccess = updateSuccess;
    updateFailed = updateFailed;
    speakersList: any;

    selectedSession: any = {topic: '', trainer: ''};
    // selectedSpeaker: any = {id: 0, name: ''};
    selectedSpeaker: any

    newParticipantModel: ParticipantAttendanceModel = new ParticipantAttendanceModel();

    speakerList: { id: number, name: string }[] = [];

    speakers: { id: number, name: string }[] = [];
    participants: ParticipantModel[] = []

    trainers: Trainer[] = []
    imageName: string;
    certificateImagehold: any;
    sessionIdHolder: number;

    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
                private _participantAttendanceService: ParticipantAttendanceService,
                private _participantService: ParticipantService,
                private route: Router,
                private _toastrService: ToastrService,
                private _activatedRoute: ActivatedRoute,
                private _courseService: CourseService,
                private _proposalService: ProposalService,
                private _fileUploadService: FileUploadService,
                private utils: UtilsService,
                private dateAdapter: DateAdapter<Date>) {
        // Language translations
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
        this.dateAdapter.setLocale('en-GB'); //dd/MM/yyyy

        this.tempAttendanceId = this._activatedRoute.snapshot.paramMap.get('id');
        if (this.tempAttendanceId != null) {
            this.isEditable = true;
            this.attendanceId = Number(this.tempAttendanceId);
        }


    }

    ngOnInit(): void {

        if (this.isEditable) {
            this._participantAttendanceService.getParticipantAttendanceById2(this.attendanceId).subscribe(
                res => {
                    this.attendanceResponse = res;

                    this.attendanceResponse.proposalId = res.proposalModel.id;
                    this.attendanceResponse.sessionId = res.courseScheduleModel.id;
                    this.attendanceResponse.speakerId = res?.trainer?.id;
                    this.attendanceResponse.attendancePhoto = res.attendancePhoto;
                    this.parseParticipantsFields(res.participantAttendanceModels);
                    this.imageName = this.utils.imageNameSpliter(this.attendanceResponse.attendancePhoto.fileName, "-", 0)
                    this.speakersList = res.courseScheduleModel.speakers;
                    this.selectedSpeaker = this.speakersList.map(data => data.id);
                    this.certificateImagehold = res.attendancePhoto;
                    console.log('data', res)
                    this.sessionIdHolder = this.attendanceResponse.sessionId;

                    this.selectedSession = res.courseScheduleModel;
                    // this.courseModel = [res.courseScheduleModel];
                    this.getCourses(res.proposalModel.id);
                    //
                    // this.trainers = res.courseScheduleModel.speakers;
                    //

                },
                error => {
                    console.log(error);
                }
            )
        }

        this._proposalService.getProposals(1000, 0).subscribe(
            res => {
                this.proposalModels = res.data

                console.log('ppp', this.proposalModels)

                // this.courseModel = {
                //     courseScheduleModels: [],
                // }
            },
            err => {
                console.log(err)
            }
        )

    }


    parseParticipantsFields(data) {
        this.participantAttendanceModels = []
        for (let i = 0; i < data.length; i++) {
            console.log(data[i])
            let participantAttendanceModel: ParticipantAttendanceModel = new ParticipantAttendanceModel();
            participantAttendanceModel.participantId = data[i].participantModel ? data[i].participantModel.id : data[i].id;
            participantAttendanceModel.participantName = data[i].name ? data[i].name : data[i].participantModel.name;
            participantAttendanceModel.isPresent = !!data[i].isPresent;
            participantAttendanceModel.speakerComment = data[i].speakerComment ? data[i].speakerComment : '';
            participantAttendanceModel.phoneNo = data[i].phoneNo ? data[i].phoneNo : data[i].participantModel?.phoneNo;
            // console.log(participantAttendanceModel)

            this.participantAttendanceModels.push(participantAttendanceModel);
        }


        this.participantAttendanceModels.sort((a, b) => {
            if (a.participantId < b.participantId) {
                return -1;
            }
            if (a.participantId > b.participantId) {
                return 1;
            }
            return 0;
        });
        this.dataSource = new MatTableDataSource(this.participantAttendanceModels);
    }


    save(isEditable: boolean) {
        this.attendanceResponse.editable = isEditable;

        this.attendanceResponse.participantAttendanceModels = this.participantAttendanceModels;

        this.attendanceResponse.sessionId = this.selectedSession.id
        this.attendanceResponse.speakerId = this.selectedSpeaker.id
        this.attendanceResponse.attendancePhoto = this.certificateImagehold;

        console.log(this.attendanceResponse);
        if (this.isEditable) {
            console.log('ttt', this.attendanceResponse)
            this._participantAttendanceService.editParticipantAttendance(this.attendanceResponse, this.attendanceId).subscribe(
                () => {
                    this._toastrService.success(updateSuccess, "Success");
                    this.route.navigate(["attendance-list"])
                },
                error => {
                    this._toastrService.error(updateFailed, "Error");
                    console.log(error)
                }
            );
        } else {
            this._participantAttendanceService.createParticipantAttendance(this.attendanceResponse).subscribe(
                response => {
                    if (response.statusCode === 404) {
                        this._toastrService.warning(response.message, "Failed");
                    } else {
                        this._toastrService.success(saveSuccess, "Success");
                        this.route.navigate(["attendance-list"])
                    }

                },
                error => {
                    this._toastrService.error(saveFailed, "Error");
                    console.log(error)
                }
            );
        }
    }


    getCourses(proposalId) {
        this._courseService.getCourseByProposalId_(proposalId).subscribe(
            res => {
                this.courseModel = res.items;
            },
            error => {
                console.log(error)
            }
        )
    }

    selectCourse(proposalId: number) {
        // this._courseService.getCourseByProposalId2(proposalId).toPromise().then(
        //     res => {
        //         this.courseModel = res;
        //     },
        //     error => {
        //         console.log(error)
        //     }
        // )
        this._courseService.getCourseByProposalId_(proposalId).toPromise().then(
            res => {
                this.courseModel = res.items;
            },
            error => {
                console.log(error)
            }
        )

        this._participantService.getParticipantsByCourseId(proposalId).subscribe(
            res => {
                console.log(res)
                this.participants = res;

                this.parseParticipantsFields(this.participants)
                // this.dataSource = new MatTableDataSource(this.participants);
            },
            err => {
                console.log(err)
            }
        )

    }

    selectSession(sessionId: number) {
        console.log(sessionId)
        this.attendanceResponse.sessionId = this.selectedSession.id

        let find = this.courseModel.find(id => id.id === sessionId);

        this.speakersList = find.speakers;

        let map = this.speakersList.map(data => data.id);

        this.selectedSession.topic = find.topic
        this.selectedSpeaker = map

        if (this.isEditable) {
            this._participantAttendanceService.checkIsExistAttendance(this.attendanceResponse).subscribe(res => {

                if (res.statusCode === 422) {
                    this.selectedSession.id = this.sessionIdHolder;
                    this._toastrService.warning(res.message, 'Warning')

                }
            }, error => {
                console.log('error', error)
            })

        } else {
            this._participantAttendanceService.checkIsExistAttendance(this.attendanceResponse).subscribe(res => {

                if (res.statusCode === 422) {
                    this.selectedSession.id = null;
                    this._toastrService.warning(res.message, 'Warning')

                }
            }, error => {
                console.log('error', error)
            })
        }


        // this.selectedSession = this.courseModel.courseScheduleModels.find(session => session.id === sessionId)
        //
        // this.trainers = this.selectedSession.speakers;


    }

    //
    // selectSession(sessionId: number) {
    //
    //     this.selectedSession = this.courseModel.courseScheduleModels.find(session => session.id === sessionId)
    //
    //     this.trainers = this.selectedSession.speakers;
    //
    //
    // }

    getParticipantNameById(participantId: number) {

        let participant = this.participants.find(ps => ps.id === participantId)

        if (participant)
            return participant.name;
        else
            return "Demo Name";
    }

    selectSpeaker(value: any) {
        this.selectedSpeaker.id = [26, 25]
        console.log(value)

    }

    uploadFile(files: FileList, tag: string) {
        this.imageName = null;
        if (tag === 'certificate_image') {
            this.imageName = null;
            this._fileUploadService.uploadFile(files[0], files[0].name, 'rms-ti').subscribe(data => {
                this.certificateImagehold = data;
            })
        }

    }
}
