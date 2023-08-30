import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { FuseTranslationLoaderService } from 'app/main/core/services/translation-loader.service';
import { AuthService } from 'app/main/modules/auth/services/auth.service';
import {
    addNewIcon,
    deleteFailed,
    deleteSuccess,
    nextIcon,
    previousIcon,
    refreshIcon,
    saveFailed,
    saveIcon,
    saveSuccess,
    updateFailed,
    updateSuccess
} from 'app/main/modules/rpm/constants/button.constants';
import { PersonalInfoFormModel } from 'app/main/modules/rpm/models/PersonalInfoFormModel';
import { UserListServiceService } from 'app/main/modules/settings/services/user-list-service.service';
import { ToastrService } from 'ngx-toastr';
import { locale as lngEnglish } from "../../../i18n/en";
import { locale as lngBangla } from "../../../i18n/bn";
import { ParticipantModel } from 'app/main/modules/training-institute/models/participant.model';
import { ParticipantService } from 'app/main/modules/training-institute/services/participant.service';
import { ProposalService } from "../../../../../../services/proposal.service";
import { ConfigurationService } from "../../../../../../../settings/services/configuration.service";
import { DateAdapter } from '@angular/material/core';
import { FileUploadService } from 'app/main/shared/services/file-upload.service';

@Component({
    selector: 'app-personal-info',
    templateUrl: './personal-info.component.html',
    styleUrls: ['./personal-info.component.scss']
})
export class PersonalInfoComponent implements OnInit {

    @Output() nextStep = new EventEmitter<boolean>();
    @Output() backPrevious = new EventEmitter<boolean>();

    @Input() newParticipantModel: ParticipantModel;
    @Input() isEditable: boolean = false;
    @Input() participantId: number;

    fileToUpload: { id: number, file: File }[] = [];
    @ViewChild('myForm') mytemplateForm: FormBuilder;

    config: { timeOut: 5000; closeButton: true; positionClass: 'toast-top-right'; enableHtml: true; };

    personalInfoFormModel: PersonalInfoFormModel = new PersonalInfoFormModel();

    /*----Button---*/
    refreshIcon = refreshIcon;
    saveIcon = saveIcon;
    previousIcon = previousIcon;
    addNewIcon = addNewIcon;
    nextIcon = nextIcon;
    /*----/Button---*/

    isUpdatedAction: boolean;
    isVerifiedNid: boolean = false;
    isVerifiedTin: boolean = false;
    profileImageName: string = null;
    signImageName: string = null;
    userList: any[] = [];
    ifAnyJobInfo: boolean = false;

    saveSuccess = saveSuccess;
    saveFailed = saveFailed;
    updateSuccess = updateSuccess;
    updateFailed = updateFailed;
    deleteSuccess = deleteSuccess;
    deleteFailed = deleteFailed;
    profileImage: String;
    profImage: any;
    // for pic edit name reset
    picReset: boolean = false;
    picReset2: boolean = false;


    howKnowAboutProgram: String[] = ["From Social Media", "From Friends", "From Teachers", "Others"];
    // ifAny: boolean;
    courseList: { id: number, name: string }[] = [];
    fiscalYears: any[] = [];

    spinner: boolean = false;
    spinner1: boolean = false;
    spinner2: boolean = false;
    spinner3: boolean = false;
    spinner4: boolean = false;
    spinner5: boolean = false;
    spinner6: boolean = false;
    spinner7: boolean = false;
    spinner8: boolean = false;
    spinner9: boolean = false;
    spinner10: boolean = false;
    spinner11: boolean = false;


    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _toastrService: ToastrService,
        private route: Router,
        private userListService: UserListServiceService,
        private _participantService: ParticipantService,
        private _proposalService: ProposalService,
        private _configurationService: ConfigurationService,
        private dateAdapter: DateAdapter<Date>,
        private _fileUploadService: FileUploadService) {
        // Language translations
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
        this.dateAdapter.setLocale('en-GB'); //dd/MM/yyyy
    }

    ngOnInit(): void {
        this.getCourseList();
        this.spinner = true;
        this._configurationService.getAllFiscalYearByFinalCopy().subscribe(
            res => {
                this.fiscalYears = res.items;
                this.spinner = false;
            },
            error => {
                console.log(error);
                this.spinner = false;
            }
        )
    }


    getCourseList() {
        this.spinner1 = true;
        this._proposalService.getProposals(2000, 0).subscribe(
            res => {
                res.data.forEach(course => {
                    this.courseList.push({ id: course.id, name: course.trainingName });
                });
                this.spinner1 = false;
            },
            error => {
                this.spinner1 = false;
            });
    }

    toggleJobInfo() {
        this.newParticipantModel.ifAnyJobInfo = !this.newParticipantModel.ifAnyJobInfo;
    }

    handleFileInput(files: FileList, index: number) {
        if (index === 0) {
            this.profileImageName = ''
        } else if (index === 1) {
            this.signImageName = ''
        }
        if (files.item(0).type === 'image/jpeg') {
            this.fileToUpload.push({ id: index, file: files.item(0) });
        } else {
            this._toastrService.error("Only *.jpeg,*.jpg,*.png Suppourted", "Warning", this.config);
            if (index === 0) {
                this.fileToUpload.splice(index, 1)
            }
            if (index === 1) {
                this.fileToUpload.splice(index, 1)
            }
        }

    }


    saveAndUpdate() {
        this.nextTab();
    }


    //age calculator
    ageCalculator() {
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
        this.save(true);
    }

    getUserList() {
        this.spinner2 = true;
        this.userListService.getAllUser().subscribe(
            res => {
                this.userList = res ? res : [];
                this.userList.forEach(element => {
                    if (element.id === this.personalInfoFormModel.userId) {
                        this.personalInfoFormModel.userId = element.name
                    }
                });
                this.spinner2 = false;
            },
            errror => {
                this.spinner2 = false;
            }
        );
    }

    save(isNext: boolean) {


        if (this.isEditable) {
            this.spinner3 = true;
            this._participantService.editParticipant(this.newParticipantModel, this.participantId).subscribe(
                res => {
                    this._toastrService.success(updateSuccess, "Success");
                    this.spinner3 = false;
                    if (isNext)
                        this.nextTab()
                    else
                        this.route.navigate(["/participant-list"]);
                },
                error => {
                    console.log(error);
                    this._toastrService.error(updateFailed, "Error");
                    this.spinner3 = false;
                }
            )
        } else {

            this.spinner4 = true;
            this._participantService.createParticipant(this.newParticipantModel).toPromise().then(
                res => {
                    this.spinner4 = false;
                    this.newParticipantModel.id = res.data
                    this.isEditable = true
                    this.participantId = res.data
                    this._toastrService.success(saveSuccess, "Success");
                    this.saveAndUpdate();
                },
                error => {
                    this._toastrService.error(saveFailed, "Error");
                    console.log(error);
                    this.spinner4 = false;
                }
            )
        }

    }

    back() {
        this.route.navigate(['/participant-list'])
    }


    uploadFile(files: FileList, tag: string) {
        if (tag === 'nid_image') {
            this.spinner5 = true;
            this._fileUploadService.uploadFile(files[0], files[0].name, 'rms-ti').subscribe(data => {
                this.newParticipantModel.nidImage = data;
                this.spinner5 = false;
            }, error => { this.spinner5 = false; })
        } else if (tag === 'profile_image') {
            this.spinner5 = true;
            this.profileImage = files[0].name;
            this._fileUploadService.uploadFile(files[0], files[0].name, 'rms-ti').subscribe(data => {
                this.newParticipantModel.image = data;
                this.spinner5 = false;
            }, error => { this.spinner5 = false; });
        }
    }
}

