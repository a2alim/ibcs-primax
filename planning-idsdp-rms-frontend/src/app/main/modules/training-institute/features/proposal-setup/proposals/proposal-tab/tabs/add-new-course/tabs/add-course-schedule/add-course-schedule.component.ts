import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FuseTranslationLoaderService} from "../../../../../../../../../../core/services/translation-loader.service";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";
import {locale as lngEnglish} from "../../i18n/en";
import {locale as lngBangla} from "../../i18n/bn";
import {
    addNewIcon,
    dataNotFount,
    deleteFailed,
    deleteSuccess,
    nextIcon,
    previousIcon,
    refreshIcon,
    saveFailed,
    saveIcon,
    saveSuccess,
    sentSuccess,
    updateFailed,
    updateSuccess
} from 'app/main/modules/rpm/constants/button.constants';
import {MatTableDataSource} from "@angular/material/table";
import {CourseScheduleModel} from "../../../../../../../../models/course-schedule.model";
import {CourseModel} from "../../../../../../../../models/course.model";
import {CourseService} from "../../../../../../../../services/course.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {TrainersService} from "../../../../../../../../services/trainers.service";
import {DateAdapter} from '@angular/material/core';
import moment from "moment";


@Component({
    selector: 'app-add-course-schedule',
    templateUrl: './add-course-schedule.component.html',
    styleUrls: ['./add-course-schedule.component.scss']
})
export class AddCourseScheduleComponent implements OnInit {

    @Output() nextStep = new EventEmitter<boolean>();
    @Output() backPrevious = new EventEmitter<boolean>();

    @Input() newCourseModel: CourseModel;
    @Input() isEditable: boolean = false;
    @Input() courseId: number;
   courseScheduleId: any;

    saveSuccess = saveSuccess;
    saveFailed = saveFailed;
    updateSuccess = updateSuccess;
    updateFailed = updateFailed;
    deleteSuccess = deleteSuccess;
    deleteFailed = deleteFailed;
    sentSuccess = sentSuccess;
    dataNotFount = dataNotFount;

    /*-----*/
    spinner: boolean = false;
    displayedColumns: string[] = ['session', 'speaker', 'topic', 'date', 'day', 'time', 'action'];
    dataSource: any;
    total: number;


    /*----Button---*/
    refreshIcon = refreshIcon;
    saveIcon = saveIcon;
    previousIcon = previousIcon;
    addNewIcon = addNewIcon;
    nextIcon = nextIcon;
    /*----/Button---*/
    form: FormGroup;
    uuid: string;

    courseSchedules: CourseScheduleModel[] = [];

    courseSchedule: CourseScheduleModel = new CourseScheduleModel();
    toppings = new FormControl();
    speakerList: { id: number, name: string }[] = [];

    constructor(private route: Router,
                private dateAdapter: DateAdapter<Date>,
                private _fuseTranslationLoaderService: FuseTranslationLoaderService,
                private _toastrService: ToastrService,
                private _trainersService: TrainersService,
                private _courseService: CourseService,
                private _formBuilder: FormBuilder) {
        // Language translations
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
        this.dateAdapter.setLocale('en-GB'); //dd/MM/yyyy
        this.getTrainerList();
    }

    ngOnInit(): void {
        this.courseScheduleId=localStorage.getItem('idForUpdate')

        if (this.isEditable) {
            this._courseService.getCourseById(this.courseId).subscribe(
                res => {

                    this.courseSchedules = res.courseScheduleModels;
                    for (let i = 0; i < this.courseSchedules.length; i++) {
                        let speakers: any[] = this.courseSchedules[i].speakers;
                        for (let z = 0; z < this.courseSchedules[i].speakers.length; z++) {
                            this.courseSchedules[i].speakers[z] = speakers[z].id;
                        }
                    }

                    this.dataSource = new MatTableDataSource(this.courseSchedules);

                },
                error => {
                    console.log(error)
                }
            )

            // this.dataSource = new MatTableDataSource(this.newCourseModel.courseSchedules);
        }
        this.form = this._formBuilder.group({
            "id": [""],
            "session": ["", {
                validators: [Validators.required]
            }], "speakers": ["", {
                validators: [Validators.required]
            }], "topic": ["", {
                validators: [Validators.required]
            }], "date": ["", {
                validators: [Validators.required]
            }], "day": ["", {
                validators: [Validators.required]
            }], "time": ["", {
                validators: [Validators.required]
            }],

        });
    }

    getTrainerList() {
        this._trainersService.getTrainersList(0, 2000,41).subscribe(res => {
            res.content.forEach(result => {
                this.speakerList.push({id: result.id, name: result.name})
            })

        })
    }

    saveAndUpdate(isNext: boolean) {
        this.newCourseModel.courseSchedules = this.courseSchedules;

        this._courseService.editCourse(this.newCourseModel, this.newCourseModel.id).subscribe(
            res => {
                console.log(res);
                localStorage.removeItem("fiscalYearForProposal")
                localStorage.removeItem("proposalIdForProposal")
                this._toastrService.success(saveSuccess, "Success");
                this.route.navigate(["/proposal-list"]);
            },
            error => {
                console.log(error);
                this._toastrService.error(saveFailed, "Error");

            }
        )

    }


    /*
    * Bottom Default Tab Options
    * */
    nextTab() {
        this.nextStep.emit(true);
    }

    previousTab(): void {
        this.backPrevious.emit(true);
    }


    addSchedule() {
        let tmp = new CourseScheduleModel();
        let formD = Object.assign(tmp, this.form.value);
        if (!this.courseSchedule.id) {
            this.courseSchedule.id = this.courseSchedules.length + 1;
            formD.id = this.courseSchedule.id;
            this.courseSchedules.push(formD);
        } else {
            // edit
            let index = this.courseSchedules.findIndex(d => d.id === formD.id);
            this.courseSchedules[index] = formD;
        }

        this.courseSchedule = new CourseScheduleModel();

        this.dataSource = new MatTableDataSource(this.courseSchedules);
        this.form.reset();
    }

    deleteSchedule(id) {
        let index = this.courseSchedules.findIndex(d => d.id === id);
        this.courseSchedules.splice(index, 1)
        console.log(index)
        this.dataSource = new MatTableDataSource(this.courseSchedules);
    }

    editSchedule(id) {
        let index = this.courseSchedules.findIndex(d => d.id === id);
        this.courseSchedule = this.courseSchedules[index];
        this.form.setValue(this.courseSchedules[index]);
    }

    getSpeakers(speakers: number[]) {
        let trainers: string[] = []
        speakers.map(sp => {
            let speaker = this.speakerList.find(spk => spk.id === sp)
            if (speaker)
                trainers.push(speaker.name)
        })
        let text="";
        trainers.forEach(data=>{
           text+=data+"<br/>"
        })

        return text;
    }

    convertDate(date: string) {
        return moment(date).format("DD-MM-YYYY");
    }
}
