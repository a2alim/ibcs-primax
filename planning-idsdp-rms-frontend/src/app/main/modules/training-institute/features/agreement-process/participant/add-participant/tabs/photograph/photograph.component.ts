import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {FuseTranslationLoaderService} from 'app/main/core/services/translation-loader.service';
import {addNewIcon, nextIcon, previousIcon, refreshIcon, saveIcon , saveFailed, saveSuccess, sentSuccess, updateFailed, updateSuccess, deleteSuccess, deleteFailed, dataNotFount} from 'app/main/modules/rpm/constants/button.constants';
import {ParticipantModel} from 'app/main/modules/training-institute/models/participant.model';
import {ToastrService} from 'ngx-toastr';
import {locale as lngEnglish} from "../../../../../../../training-institute/features/proposal-setup/course-schedule/i18n/en";
import {locale as lngBangla} from "../../../../../../../training-institute/features/proposal-setup/course-schedule/i18n/bn";
import {ParticipantService} from 'app/main/modules/training-institute/services/participant.service';
import {CourseScheduleModel} from "../../../../../../models/course-schedule.model";
import {FileUploadService} from "../../../../../../../../shared/services/file-upload.service";


@Component({
    selector: 'app-photograph',
    templateUrl: './photograph.component.html',
    styleUrls: ['./photograph.component.scss']
})
export class PhotographComponent implements OnInit {

    @Output() nextStep = new EventEmitter<boolean>();
    @Output() backPrevious = new EventEmitter<boolean>();

    @Input() newParticipantModel: ParticipantModel;
    @Input() isEditable: boolean = false;
    @Input() participantId: number;
    // for pic edit name reset
    picReset: boolean = false;
    picReset2: boolean = false;
    /*-----*/
    spinner: boolean = false;
    dataSource: any;
    total: number;
    profileImage: String;
    profImage: any;

    /*----Button---*/
    refreshIcon = refreshIcon;
    saveIcon = saveIcon;
    previousIcon = previousIcon;
    addNewIcon = addNewIcon;
    nextIcon = nextIcon;
    /*----/Button---*/

    updateSuccess = updateSuccess;
    updateFailed = updateFailed;

    uuid: string;

    courseSchedules: CourseScheduleModel[];
    newCourseModel: any;

    constructor(
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private route: Router,
        private _toastrService: ToastrService,
        private _participantService: ParticipantService,
        private _fileUploadService: FileUploadService) {
        // Language translations
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

    ngOnInit(): void {

        if (this.isEditable) {
            this._participantService.getParticipantById(this.participantId).subscribe(
                () => {

                },
                error => {
                    console.log(error)
                }
            )
        }
    }

    saveAndUpdate() {
        console.log(this.newParticipantModel);


        this._participantService.editParticipant(this.newParticipantModel, this.newParticipantModel.id).subscribe(
            res => {
                console.log(res);
                this._toastrService.success(updateSuccess, "Success");
                this.route.navigate(["/participant-list"]);
            },
            error => {
                console.log(error);
                this._toastrService.error(updateFailed, "Error");
            }
        )

    }

    uploadFile(files: FileList, tag: string) {
        if (tag === 'nid_image') {
            this._fileUploadService.uploadFile(files[0], files[0].name, 'rms-ti').subscribe(data => {
                this.newParticipantModel.nidImage = data;
            })
        } else if (tag === 'profile_image') {
            this.profileImage = files[0].name;
            this._fileUploadService.uploadFile(files[0], files[0].name, 'rms-ti').subscribe(data => {
                this.newParticipantModel.image = data;
            })
        }
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

}

