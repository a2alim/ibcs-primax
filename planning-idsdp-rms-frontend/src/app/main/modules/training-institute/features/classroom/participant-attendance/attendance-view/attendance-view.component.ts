import {Component, OnInit} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {AttendanceResponse, ParticipantAttendanceModel, Trainer} from "../../../../models/attendance-response.model";
import {ProposalModel} from "../../../../models/proposal.model";
import {ParticipantModel} from "../../../../models/participant.model";
import {FuseTranslationLoaderService} from "../../../../../../core/services/translation-loader.service";
import {ParticipantAttendanceService} from "../../../../services/participant-attendance.service";
import {ParticipantService} from "../../../../services/participant.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {CourseService} from "../../../../services/course.service";
import {TrainersService} from "../../../../services/trainers.service";
import {ProposalService} from "../../../../services/proposal.service";
import {MatDialog} from "@angular/material/dialog";
import {locale as lngEnglish} from "../i18n/en";
import {locale as lngBangla} from "../i18n/bn";
import {
    addNewIcon,
    downloadIcon,
    editIcon,
    noteIcon,
    pdfIcon,
    previousIcon,
    printIcon
} from 'app/main/modules/rpm/constants/button.constants';

@Component({
    selector: 'app-attendance-view',
    templateUrl: './attendance-view.component.html',
    styleUrls: ['./attendance-view.component.scss']
})
export class AttendanceViewComponent implements OnInit {

    spinner: boolean = false;
    displayedColumns: string[] = ['sl', 'participantName','phoneNo', 'present', 'speakerComment'];
    dataSource: MatTableDataSource<ParticipantAttendanceModel>;

    /*----Button---*/
    previousIcon = previousIcon;
    downloadIcon = downloadIcon;
    printIcon = printIcon;
    noteIcon = noteIcon;
    editIcon = editIcon;
    addNewIcon = addNewIcon;
    pdfIcon = pdfIcon;
    /*----/Button---*/

    //Variable
    isEditable: boolean = false;
    participantAttendanceModels: ParticipantAttendanceModel[] = [];

    attendanceResponse: AttendanceResponse = new AttendanceResponse();

    isUpdatedAction: boolean;

    proposalModels: ProposalModel[] = [];
    courseModel: any = {courseScheduleModels: []};

    attendanceId: number;
    tempAttendanceId: String;

    // sessions: CourseScheduleModel[] = []

    // courses: CourseResponse[] = []
    selectedSession: any = {topic: '', trainer: ''};
    selectedSpeaker: any = {id: 0, name: ''};

    newParticipantModel: ParticipantAttendanceModel = new ParticipantAttendanceModel();

    speakerList: { id: number, name: string }[] = [];

    speakers: { id: number, name: string }[] = [];
    participants: ParticipantModel[] = []

    trainers: Trainer[] = []

    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
                private _participantAttendanceService: ParticipantAttendanceService,
                private _activatedRoute: ActivatedRoute) {
        // Language translations
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);

        this.tempAttendanceId = this._activatedRoute.snapshot.paramMap.get('id');
        if (this.tempAttendanceId != null) {
            this.attendanceId = Number(this.tempAttendanceId);
        }


    }

    ngOnInit(): void {

        this.spinner = true;
        this._participantAttendanceService.getParticipantAttendanceById2(this.attendanceId).subscribe(
            res => {
                this.attendanceResponse = res;

                this.parseParticipantsFields(res.participantAttendanceModels);

                console.log('res',this.attendanceResponse)

                this.spinner = false;
            },
            error => {
                console.log(error);
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
            participantAttendanceModel.phoneNo = data[i].phoneNo?data[i].phoneNo:data[i].participantModel?.phoneNo;
            // console.log(participantAttendanceModel)

            this.participantAttendanceModels.push(participantAttendanceModel);
        }

        console.log(this.participantAttendanceModels)

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

    print() {
        window.print();
    }

    download() {

    }
}
