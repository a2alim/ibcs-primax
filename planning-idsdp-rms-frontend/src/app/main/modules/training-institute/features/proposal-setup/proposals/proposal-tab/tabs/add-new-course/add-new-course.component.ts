import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FuseTranslationLoaderService} from "../../../../../../../../core/services/translation-loader.service";
import {FormBuilder} from "@angular/forms";
import {locale as lngEnglish} from "./i18n/en";
import {locale as lngBangla} from "./i18n/bn";
import {MatStepper} from "@angular/material/stepper";
import {StepperSelectionEvent} from "@angular/cdk/stepper";
import {CourseService} from "../../../../../../services/course.service";
import {CourseModel} from "../../../../../../models/course.model";
import {ToastrService} from "ngx-toastr";
import {ActivatedRoute} from "@angular/router";

@Component({
    selector: 'app-add-new-course',
    templateUrl: './add-new-course.component.html',
    styleUrls: ['./add-new-course.component.scss']
})
export class AddNewCourseComponent implements OnInit {

    @Output() nextStep = new EventEmitter<boolean>();
    @Output() backPrevious = new EventEmitter<boolean>();

    newCourseModel: CourseModel = new CourseModel();
    courseId: number;
    tempCourseId: string;
    isEditable: boolean = false;
    courseScheduleId:any

    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
                private _activatedRoute: ActivatedRoute,
                private _courseService: CourseService) {
        // Language translations
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);

        this.tempCourseId = this._activatedRoute.snapshot.paramMap.get('courseScheduleId');
        if (this.tempCourseId != null) {
            this.isEditable = true;
            this.courseId = Number(this.tempCourseId);
        }else{
            this.courseScheduleId =this.tempCourseId
        }

        console.log(this.courseId);

    }

    ngOnInit(): void {

        if (this.isEditable) {
            this._courseService.getCourseById(this.courseId).subscribe(
                res => {
                    this.newCourseModel.courseSchedules = res.courseScheduleModels;
                    for (let i = 0; i < this.newCourseModel.courseSchedules.length; i++) {
                        let speakers: any[] = this.newCourseModel.courseSchedules[i].speakers;
                        for (let z = 0; z < this.newCourseModel.courseSchedules[i].speakers.length; z++) {
                            this.newCourseModel.courseSchedules[i].speakers[z] = speakers[z].id;
                        }
                    }
                    // this.newCourseModel.courseTitle = res.courseTitle;

                    this.newCourseModel.proposalId = res.proposalModel.id;
                    this.newCourseModel.totalHours = res.totalHours;
                    this.newCourseModel.programDuration = res.programDuration;
                    this.newCourseModel.comment = res.comment;
                    this.newCourseModel.fiscalYearId = res.fiscalYearId;
                    this.newCourseModel.id = res.id


                }
            );
        }

        // else {
        //     this.newCourseModel = new CourseModel();
        // }
    }

    goBack(stepper: MatStepper): void {
        stepper.previous();
    }

    goForward(stepper: MatStepper): void {
        stepper.next();

    }

    selectionChanged($event: StepperSelectionEvent) {
        if ($event.selectedIndex === 1) {

        }
    }

    goBackToHome() {
        window.history.back();
    }
    nextTab() {
        this.nextStep.emit(true);
    }

    previousTab(): void {
        this.backPrevious.emit(true);
    }
}
