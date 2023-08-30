import {
    Component,
    EventEmitter,
    OnInit,
    Output,
    ViewChild,
} from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
    addNewIcon,
    deleteIcon,
    nextIcon,
    previousIcon,
    refreshIcon,
    saveIcon,
} from 'app/main/modules/rpm/constants/button.constants';
import { FileValidatorService } from 'app/main/modules/rpm/services/file-validator.service';
import { GlobalValidationService } from 'app/main/shared/services/global-validation.service';
import { ToastrService } from 'ngx-toastr';
import { FuseTranslationLoaderService } from '../../../../../core/services/translation-loader.service';
import { FileUploadService } from '../../../../../shared/services/file-upload.service';
import { AuthService } from '../../../../auth/services/auth.service';
import { ProfileModel } from '../../../models/profile.model';
import { TrainingInstituteProfileService } from '../../../services/training-institute-profile.service';
import { UtilsService } from '../../../services/utils.service';
import { locale as lngBangla } from '../../profiles/i18n/bn';
import { locale as lngEnglish } from '../../profiles/i18n/en';
@Component({
    selector: 'app-profile-edit',
    templateUrl: './profile-edit.component.html',
    styleUrls: ['./profile-edit.component.scss'],
})
export class ProfileEditComponent implements OnInit {
    //Icon
    refreshIcon = refreshIcon;
    saveIcon = saveIcon;
    deleteIcon = deleteIcon;
    previousIcon = previousIcon;
    addNewIcon = addNewIcon;
    nextIcon = nextIcon;
    frmGroup: FormGroup;
    @ViewChild('inputForm') inputForm: NgForm;
    @Output() nextStep = new EventEmitter<boolean>();
    @Output() backPrevious = new EventEmitter<boolean>();
    @Output() profileIdM3 = new EventEmitter<number>();
    profileModel: ProfileModel = new ProfileModel();
    //Toast Config
    config: {
        timeOut: 5000;
        closeButton: true;
        positionClass: 'toast-top-right';
        enableHtml: true;
    };
    fiscalYears: any[] = [];
    tempTrainerId: any;
    trainerId: number;
    isEditable: boolean = false;
    loggedUserId: any;
    profileId: any;
    profileModelreponse: any = {};
    imgSpinner: boolean = false;
    imgSpinner2: boolean = false;
    spinner: boolean = false;
    constructor(
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private dateAdapter: DateAdapter<Date>,
        private _toastrService: ToastrService,
        private _fileUploadService: FileUploadService,
        private _router: Router,
        private _trainingInstituteProfileService: TrainingInstituteProfileService,
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,
        private fileUtils: UtilsService,
        private _fileValidatorService: FileValidatorService,
        private validation: GlobalValidationService
    ) {
        // Language translations
        this._fuseTranslationLoaderService.loadTranslations(
            lngEnglish,
            lngBangla
        );
        this.dateAdapter.setLocale('en-GB'); //dd/MM/yyyy
        this.tempTrainerId = this._activatedRoute.snapshot.paramMap.get('id');
        if (this.tempTrainerId != null) {
            this.isEditable = true;
            this.trainerId = Number(this.tempTrainerId);
        }
        this.getLoggedUserDetails();
    }
    ngOnInit(): void {
        this.profileId = this._activatedRoute.snapshot.paramMap.get('uuid');
        if (this.profileId) {
            this.isEditable = true;
            console.log(this.profileId);
            this.getProfileById();
        }
    }
    resizeImage(imgSize) {
        window.open('/resize-image?size=' + imgSize, '_blank');
    }
    resetImageValue(tag: string, fineName: string = '') {
        // console.log("fineName = ", fineName.length);
        // console.log('tag= ', tag);
        if (tag === 'profile_image') {
            fineName.length == 0
                ? (document
                      .getElementById('tiProfileImage')
                      .getElementsByTagName('span')[0].innerText = '')
                : (document
                      .getElementById('tiProfileImage')
                      .getElementsByTagName('span')[0].innerText = fineName);
        }
        if (tag === 'sign_image') {
            fineName.length == 0
                ? (document
                      .getElementById('tiSignImageVariable')
                      .getElementsByTagName('span')[0].innerText = '')
                : (document
                      .getElementById('tiSignImageVariable')
                      .getElementsByTagName('span')[0].innerText = fineName);
        }
    }
    uploadFile(files: FileList, tag: string, maxIwidth, maxIheight) {
        var validExt = ['jpeg', 'jpg', 'png'];
        var ext = files.item(0).name.split('.').pop();
        if (validExt.indexOf(ext.toLowerCase()) == -1) {
            this._toastrService.error(
                'Only support jpd, jpeg and png file type',
                '',
                this.config
            );
            this.resetImageValue(tag);
            return;
        }
        let fileSize = +(files[0].size / 1024).toFixed(2);
        console.log('files.item(0) = ', files[0]);
        console.log('fileSize = ', fileSize);
        if (fileSize > 1024) {
            this._toastrService.error(
                'File size should be maximum 1MB',
                '',
                this.config
            );
            return;
        }
        this._fileValidatorService.isValidateFileHeightWidth(
            (e) => {
                if (e) {
                    if (tag === 'profile_image') {
                        this.resetImageValue(tag, files[0].name);
                        this.imgSpinner = true;
                        this._fileUploadService
                            .uploadFile(files[0], files[0].name, 'rms-ti')
                            .subscribe((data) => {
                                this.profileModel.profileImage = data;
                                this.imgSpinner = false;
                            });
                    } else if (tag === 'sign_image') {
                        this.resetImageValue(tag, files[0].name);
                        this.imgSpinner2 = true;
                        this._fileUploadService
                            .uploadFile(files[0], files[0].name, 'rms-ti')
                            .subscribe((data) => {
                                this.profileModel.signImage = data;
                                this.imgSpinner2 = false;
                            });
                    }
                } else {
                    this.resetImageValue(tag);
                    this._toastrService.error(
                        'Image size should be ' +
                            maxIwidth +
                            'pixel * ' +
                            maxIheight +
                            'pixel',
                        '',
                        this.config
                    );
                }
            },
            files.item(0),
            maxIheight,
            maxIwidth
        );
    }
    ImageSpliter(file: string) {
        return this.fileUtils.imageNameSpliter(file + '', '-', 0);
    }
    save() {
        this.spinner = true;
        let gg = this.validation.formValidation(this.profileModel);
        let validation = this.checkRequirdField();
        if (validation) {
            this._trainingInstituteProfileService
                .saveProfileForTrainingInstitute(this.profileModel)
                .subscribe(
                    (data) => {
                        localStorage.setItem('ProfileIdForM3', data.id);
                        this._toastrService.success(
                            'Saved successfully',
                            'Success',
                            this.config
                        );
                        this.spinner = false;
                        //this.back();
                    },
                    (error) => {
                        this._toastrService.error(
                            'Saved successfully',
                            'Error',
                            this.config
                        );
                    }
                );
        } else {
            this._toastrService.warning(
                'Please enter the required information !.',
                '',
                this.config
            );
            this.spinner = false;
        }
    }
    saveandNext() {
        this.spinner = true;
        let gg = this.validation.formValidation(this.profileModel);
        let validation = this.checkRequirdField();
        if (!validation) {
            this._toastrService.warning(
                'Please enter the required information !.',
                '',
                this.config
            );
            this.spinner = false;
            return;
        }
        this._trainingInstituteProfileService
            .saveProfileForTrainingInstitute(this.profileModel)
            .subscribe(
                (data) => {
                    localStorage.setItem('ProfileIdForM3', data.id);
                    this._toastrService.success(
                        'Saved successfully',
                        'Success',
                        this.config
                    );
                    this.spinner = false;

                    setTimeout((res) => this.nextTab(), 100)
                    // this.nextTab();

                },
                (error) => {
                    this._toastrService.error(
                        'Saved successfully',
                        'Error',
                        this.config
                    );
                }
            );
    }
    checkRequirdField(): Boolean {
        let isValied = true;
        let profileModel = this.profileModel;
        if (
            !profileModel.headOfInstituteName ||
            !profileModel.designation ||
            !profileModel.mobileNumber ||
            !profileModel.profileImage?.fileName ||
            !profileModel.signImage?.fileName ||
            !profileModel.permanentAddress ||
            !profileModel.accountName ||
            !profileModel.accountNumber ||
            !profileModel.bankName ||
            !profileModel.branchName ||
            !profileModel.routingNumber ||
            !profileModel.dateOfBirth
        ) {
            isValied = false;
        }
        return isValied;
    }
    getProfileById() {
        this._trainingInstituteProfileService
            .getProfileViewById(this.profileId)
            .subscribe(
                (data) => {
                    this.profileModelreponse = data;
                    this.profileModel.audioVisual =
                        this.profileModelreponse.audioVisual;
                    this.profileModel.trainingRoom =
                        this.profileModelreponse.trainingRoom;
                    this.profileModel.supportingStaff =
                        this.profileModelreponse.supportingStaff;
                    this.profileModel.dateOfBirth =
                        this.profileModelreponse.dateOfBirth;
                    this.profileModel.nidNo = this.profileModelreponse.nidNo;
                    this.profileModel.presentAddress =
                        this.profileModelreponse.presentAddress;
                    this.profileModel.permanentAddress =
                        this.profileModelreponse.permanentAddress;
                    this.profileModel.profileImage =
                        this.profileModelreponse.profileImage;
                    this.profileModel.signImage =
                        this.profileModelreponse.signImage;
                    this.profileModel.signImage =
                        this.profileModelreponse.signImage;
                    this.profileModel.telephoneNumber =
                        this.profileModelreponse.telephoneNumber;
                    this.profileModel.bankName =
                        this.profileModelreponse.bankName;
                    this.profileModel.branchName =
                        this.profileModelreponse.branchName;
                    this.profileModel.accountName =
                        this.profileModelreponse.accountName;
                    this.profileModel.accountNumber =
                        this.profileModelreponse.accountNumber;
                    this.profileModel.routingNumber =
                        this.profileModelreponse.routingNumber;
                },
                (error) => {}
            );
    }
    private getLoggedUserDetails() {
        this._authService.getLoggedUserDetailsById().subscribe((data) => {
            this.loggedUserId = data.id;
            this.profileModel.id = data.id;
            this.profileModel.userId = data.id;
            this.profileModel.trainingInstituteName = data.organigationName;
            this.profileModel.headOfInstituteName = data.name;
            this.profileModel.email = data.emailId;
            this.profileModel.dateOfBirth = data.dateOfBirth;
            this.profileModel.designation = data.designation;
            this.profileModel.mobileNumber = data.mobileNumber;
            this.profileModel.userType = data.userType;
        });
    }
    reset() {
        this.profileModel = new ProfileModel();
        this.getLoggedUserDetails();
    }
    back() {
        this._router.navigate([
            '/profile/' +
                '739bc694-b2dd-43b5-ab2c-925aac9075bf$' +
                this.loggedUserId,
        ]);
    }
    nextTab() {
        this.nextStep.emit(true);
    }
    previousTab(): void {
        this.backPrevious.emit(true);
    }
    onChangeAll(event) {
        if (event.checked) {
            this.profileModel.audioVisual = true;
            this.profileModel.trainingRoom = true;
            this.profileModel.supportingStaff = true;
        } else {
            this.profileModel.audioVisual = false;
            this.profileModel.trainingRoom = false;
            this.profileModel.supportingStaff = false;
        }
    }
}
