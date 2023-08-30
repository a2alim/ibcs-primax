import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PersonalInfoFormModel} from "../../../../../../../../../rpm/models/PersonalInfoFormModel";
import {FuseTranslationLoaderService} from "../../../../../../../../../../core/services/translation-loader.service";
import {ToastrService} from "ngx-toastr";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../../../../../../../../auth/services/auth.service";
import {TrainersService} from "../../../../../../../../services/trainers.service";
import {locale as lngEnglish} from "../../i18n/en";
import {locale as lngBangla} from "../../i18n/bn";
import {addNewIcon, nextIcon, previousIcon, refreshIcon, saveIcon} from 'app/main/modules/rpm/constants/button.constants';
import {CourseModel} from "../../../../../../../../models/course.model";
import {ConfigurationService} from "../../../../../../../../../settings/services/configuration.service";
import {CourseService} from "../../../../../../../../services/course.service";
import {ProposalModel} from "../../../../../../../../models/proposal.model";
import {ProposalService} from "../../../../../../../../services/proposal.service";
import {  dataNotFount, deleteFailed, deleteSuccess, saveFailed, saveSuccess, sentSuccess, updateFailed, updateSuccess } from 'app/main/modules/rpm/constants/button.constants';

@Component({
    selector: 'app-course-title',
    templateUrl: './course-title.component.html',
    styleUrls: ['./course-title.component.scss']
})
export class CourseTitleComponent implements OnInit {

    @Output() nextStep = new EventEmitter<boolean>();
    @Output() backPrevious = new EventEmitter<boolean>();

    @Input() newCourseModel: CourseModel;
    @Input() courseId: number;

    isEditable: boolean = false;

    config: { timeOut: 5000; closeButton: true; positionClass: 'toast-top-right'; enableHtml: true; };

    personalInfoFormModel: PersonalInfoFormModel = new PersonalInfoFormModel();
    proposals: ProposalModel[] = [];

    /*----Button---*/
    refreshIcon = refreshIcon;
    saveIcon = saveIcon;
    previousIcon = previousIcon;
    addNewIcon = addNewIcon;
    nextIcon = nextIcon;
    /*----/Button---*/


    saveSuccess = saveSuccess;
    saveFailed = saveFailed;
    updateSuccess = updateSuccess;
    updateFailed = updateFailed;
    deleteSuccess = deleteSuccess;
    deleteFailed = deleteFailed;
    sentSuccess = sentSuccess;
    dataNotFount = dataNotFount;


    isUpdatedAction: boolean;
    fiscalYears: any [] = [];

    speakerList: { id: number, name: string }[] = [];


    uuid: string;

    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
                private _toastrService: ToastrService,
                private _router: Router,
                private _configurationService: ConfigurationService,
                private _trainersService: TrainersService,
                private _courseService: CourseService,
                private _proposalService: ProposalService) {

        // Language translations
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);

    }

    ngOnInit(): void {
        this._configurationService.getAllFiscalYearByFinalCopy().subscribe(
            res => {
                this.fiscalYears = res.items;
            },
            error => {
                console.log(error)
            }
        )

        this._proposalService.getProposals(1000, 0).subscribe(
            res => {
                this.proposals = res.data;
            },
            error => {
                console.log(error)
            }
        )

        this.getTrainerList();
        let promise = Promise.resolve(this.newCourseModel);
        promise.then(res => {
            console.log(res);
        })

        if (this.courseId) {
            this.isEditable = true;
        }

    }


    getTrainerList() {

        this._trainersService.getTrainersList(0, 1000,41).subscribe(res => {
            console.log(res)
            res.content.forEach(result => {
                this.speakerList.push({id: result.id, name: result.name})
            })

        })
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

    saveAndNext() {
        this.save(true)

    }

    save(isNextPage: boolean) {
        this.nextTab();
        
        this.newCourseModel.fiscalYearId = Number(localStorage.getItem("fiscalYearForProposal"));
        this.newCourseModel.proposalId = Number(localStorage.getItem("proposalIdForProposal"));
        if (this.courseId) {
            console.log(this.newCourseModel);
            this._courseService.editCourse(this.newCourseModel, this.courseId).subscribe(
                () => {
                    this._toastrService.success(updateSuccess, "Success")
                    this.newCourseModel.id = this.courseId
                    this.nextTab();
                },
                error => {
                    this._toastrService.error(updateFailed, "Error");
                    console.log(error)
                }
            )
        } else {
            this._courseService.createCourse(this.newCourseModel).subscribe(
                res => {
                    this._toastrService.success(saveSuccess, "Success")
                    this.courseId = res.data;
                    this.newCourseModel.id = res.data
                    this.nextTab();
                },
                error => {
                    this._toastrService.error(saveFailed, "Error");
                    console.log(error)
                }
            )
        }

    }
}
