import {Component, OnInit} from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {PageEvent} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {Router} from '@angular/router';
import {DEFAULT_PAGE, DEFAULT_SIZE} from 'app/main/core/constants/constant';
import {FuseTranslationLoaderService} from 'app/main/core/services/translation-loader.service';
import {addNewIcon} from 'app/main/modules/rpm/constants/button.constants';
import {ParticipantAttendanceService} from 'app/main/modules/training-institute/services/participant-attendance.service';
import {locale as lngEnglish} from "../i18n/en";
import {locale as lngBangla} from "../i18n/bn";
import {AttendanceModel} from "../../../../models/attendance.model";
import {CourseService} from "../../../../services/course.service";
import {TrainersService} from "../../../../services/trainers.service";
import {CourseResponse} from "../../../../models/course-response.model";
import {ConfirmDialogConstant} from "../../../../../../shared/constant/confirm.dialog.constant";
import {SubmitConfirmationDialogComponent} from "../../../../../../shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component";
import { DateAdapter } from '@angular/material/core';

@Component({
    selector: 'app-attendance-list',
    templateUrl: './attendance-list.component.html',
    styleUrls: ['./attendance-list.component.scss']
})
export class AttendanceListComponent implements OnInit {

    spinner: boolean = false;
    displayedColumns: string[] = ['sl', 'courseTitle', 'session', 'speaker', 'topic', 'date', 'savedStatus', 'action'];
    dataSource: MatTableDataSource<any>;
    fiscalYearId: number;
    total: number;
    size: number = DEFAULT_SIZE;
    page: number = DEFAULT_PAGE;

    addNewIcon = addNewIcon;

    courses: CourseResponse[] = []
    speakerList: { id: number, name: string }[] = [];
    attendances: AttendanceModel[] = []
     courseSchedule: any;

    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
                private route: Router,
                private _participantAttendanceService: ParticipantAttendanceService,
                private dialog: MatDialog,
                private _courseService: CourseService,
                private _trainersService: TrainersService,
                private dateAdapter: DateAdapter<Date>) {

        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
        this.dateAdapter.setLocale('en-GB'); //dd/MM/yyyy
    }

    ngOnInit(): void {
        //this.getTrainerList();
        //this.getCourseList();

        this.getParticipantAttendanceList();


    }

    openDialog(id) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = false;
        dialogConfig.width = ConfirmDialogConstant.WIDTH;
        dialogConfig.height = ConfirmDialogConstant.HEIGHT;
        dialogConfig.panelClass = ConfirmDialogConstant.PANEL_CLASS;
        dialogConfig.data = {message: ConfirmDialogConstant.MESSAGE};
        const dialogRef = this.dialog.open(SubmitConfirmationDialogComponent, dialogConfig);

        dialogRef.componentInstance.closeEventEmitter.subscribe(res => {
            if (res) {
                this.deleteAttendance(id);
            }
            dialogRef.close(true);
        });
    }

    getParticipantAttendanceList() {
        this._participantAttendanceService.getParticipantAttendanceList(this.size, this.page).subscribe(
            res => {
                this.total = res.totalItems;
                this.attendances = res.data;

                let data: any[] = res.data;

                console.log('data',data)

                for (let i = 0; i < data.length; i++) {
                    data[i].courseTitle = data[i].proposalModel.trainingName
                    data[i].session = data[i].courseScheduleModel.session
                    data[i].speakerName = this.getSpeakerName(data[i].courseScheduleModel.speakers);
                    data[i].topicName = data[i].courseScheduleModel.topic
                    data[i].isDraft = data[i].editable ? 'Draft' : 'Submitted'
                }

                this.dataSource = new MatTableDataSource<any>(data);
                console.log(this.attendances)
            },
            error => {
                console.log("Error: " + error);
            }
        )
    }


    getSpeakerName(speakers){
        let speaker='';
        speakers.forEach(data=>{
            if(speaker===''){
                speaker+=data.name
            }else{
                speaker+='</br>'+data.name
            }

        })

        return speaker
    }


    getCourseNameById(courseId: number) {
        let course = this.courses.find(cs => cs.id === courseId)

        if (course)
            return course.courseTitle
        else
            return "Demo Course"
    }


    onChangePage(event: PageEvent) {

        this.size = +event.pageSize; // get the pageSize
        this.page = +event.pageIndex; // get the current page

        this.getParticipantAttendanceList();
    }

    // dialog before status chnage
    onCheckBoxChange(checked: boolean, id){
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = false;
        dialogConfig.width = ConfirmDialogConstant.WIDTH;
        dialogConfig.height = ConfirmDialogConstant.HEIGHT;
        dialogConfig.panelClass = ConfirmDialogConstant.PANEL_CLASS;
        dialogConfig.data = {message: 'Are you sure that you want change the status?'};
        const dialogRef = this.dialog.open(SubmitConfirmationDialogComponent, dialogConfig);

        dialogRef.componentInstance.closeEventEmitter.subscribe(res => {
            if (res) {
                this.changeCompleteStatus(checked, id);
            }
            dialogRef.close(true);
        });
    }

    changeCompleteStatus(checked: boolean, id) {
        // console.log(checked)
        // this._participantAttendanceService.changeCompleteStatus(id, checked).subscribe(
        //     res => {
        //         this._toastService.success("Complete Status Changed", "Success");
        //         this.getParticipantAttendanceList();
        //     },
        //     error => {
        //         console.log("Error: " + error);
        //     }
        // );
    }


    viewDetails(id: number) {
        this.route.navigate(['attendance-list/view/' + id]);
    }

    editParticipantAttendance(id) {
        this.route.navigate(["/attendance-list/edit", id])
    }


    getTrainerList() {
        this._trainersService.getTrainersList(0, 1000,45).subscribe(res => {
            this.speakerList = []
            res.content.forEach(result => {
                this.speakerList.push({id: result.id, name: result.name})
            })
            console.log(this.speakerList)
        })
    }

    getSessionNameById(courseId: number, sessionId: number) {
        let course = this.courses.find(cs => cs.id === courseId);

        if (!course)
            return "Demo Session"

        let courseSchedule = course.courseScheduleModels.find(cs => cs.id === sessionId)

        if (courseSchedule)
            return courseSchedule.session
        else
            return "Demo Session"
    }

    getSpeakerNameById(speakerId: number) {
        let speaker = this.speakerList.find(sp => sp.id === speakerId)

        if (speaker)
            return speaker.name;
        else
            return "Demo Speaker"
    }

    getTopicById(courseId: number, sessionId: number) {
        let course = this.courses.find(cs => cs.id === courseId);

        if (!course)
            return "Demo Session"

        let courseSchedule = course.courseScheduleModels.find(cs => cs.id === sessionId)


        if (courseSchedule)
            return courseSchedule.topic
        else
            return "Demo Topic"
    }

    private deleteAttendance(id: number) {

        this._participantAttendanceService.deleteAttendance(id).subscribe(
            () => {
                this.getParticipantAttendanceList();
            },
            error => {
                console.log(error)
            }
        );

    }

    private getCourseBySessionId(id) {
        this._courseService.getCourseBySessionId_(id).subscribe(
            res => {
                this.courseSchedule = res.obj;
            },
            error => {
                console.log(error)
            }
        )
    }





    private getCourseList() {
        this._courseService.getCourseList(2000, 0).subscribe(
            res => {
                this.courses = res.data;

            },
            error => {
                console.log(error)
            }
        )
    }

    applyFilter($event: KeyboardEvent) {
        const filterValue = ($event.target as HTMLInputElement).value;
        //
        // this.dataSource.filterPredicate = (data: any, filter) => {
        //     const dataStr = JSON.stringify(data).toLowerCase();
        //     return dataStr.indexOf(filter) != -1;
        // }

        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }
}
