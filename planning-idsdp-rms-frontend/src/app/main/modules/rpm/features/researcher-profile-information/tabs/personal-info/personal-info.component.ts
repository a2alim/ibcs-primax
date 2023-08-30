import {
    Component,
    ElementRef,
    EventEmitter,
    OnInit,
    Output,
    ViewChild,
} from '@angular/core';
//----Lng Translation----
import { FormBuilder } from '@angular/forms';
import {MatCheckbox, MatCheckboxChange} from '@angular/material/checkbox';
import { DateAdapter } from '@angular/material/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseTranslationLoaderService } from 'app/main/core/services/translation-loader.service';
import { AuthService } from 'app/main/modules/auth/services/auth.service';
import {
    addNewIcon,
    nextIcon,
    previousIcon,
    refreshIcon,
    saveIcon,
} from 'app/main/modules/rpm/constants/button.constants';
import { UserListServiceService } from 'app/main/modules/settings/services/user-list-service.service';
import { ToastrService } from 'ngx-toastr';
import { OtpComponent } from '../../../../../../shared/components/otp/otp.component';
import { ConfirmDialogConstant } from '../../../../../../shared/constant/confirm.dialog.constant';
import { PersonalInfoFormModel } from '../../../../models/PersonalInfoFormModel';
import { FileValidatorService } from '../../../../services/file-validator.service';
import { ResearchProfileMultiFormService } from '../../../../services/research-profile-multi-form.service';
import { SmsService } from '../../../../services/sms.service';
import { locale as lngBangla } from '../../i18n/bn';
import { locale as lngEnglish } from '../../i18n/en';
@Component({
    selector: 'app-personal-info',
    templateUrl: './personal-info.component.html',
    styleUrls: ['./personal-info.component.scss'],
})
export class PersonalInfoComponent implements OnInit {
    @Output() nextStep = new EventEmitter<boolean>();
    @Output() backPrevious = new EventEmitter<boolean>();
    @ViewChild('profileImage') profileImageVariable: ElementRef;
    @ViewChild('signImage') signImageVariable: ElementRef;
    fileToUpload: { id: number; file: File }[] = [];
    @ViewChild('myForm') mytemplateForm: FormBuilder;
    @ViewChild('sameAddressCheckbox') sameAddressCheckbox: MatCheckbox;
    researchNo = new Array<{
        id: string;
    }>();
    config: {
        timeOut: 5000;
        closeButton: true;
        positionClass: 'toast-top-right';
        enableHtml: true;
    };
    todayDate:Date = new Date();
    personalInfoFormModel: PersonalInfoFormModel = new PersonalInfoFormModel();
    /*----Button---*/
    refreshIcon = refreshIcon;
    saveIcon = saveIcon;
    previousIcon = previousIcon;
    addNewIcon = addNewIcon;
    nextIcon = nextIcon;
    /*----/Button---*/
    researcherName: string;
    isUpdatedAction: boolean;
    isVerifiedNid: boolean = false;
    isPhoneVerified: boolean = false;
    isVerifiedTin: boolean = false;
    profileImageName: string = null;
    signImageName: string = null;
    userList: any[] = [];
    uuid: string;
    uid: number = null;
    initSave: boolean = false;
    smallScreen = localStorage.getItem('smallScreen')
        ? JSON.parse(localStorage.getItem('smallScreen'))
        : 0;
    divisionList = [
        // {id:1,nameBn:'Dhaka',nameEn:''},
    ];
    districtList = [
        { id: 1, divisionId: 1, nameBn: 'DHaka District', nameEn: '' },
        { id: 1, divisionId: 2, nameBn: 'Kulna District', nameEn: '' },
    ];
    upzilaList = [
        { id: 1, districtId: 1, nameBn: 'DHaka Sador', nameEn: '' },
        { id: 2, districtId: 2, nameBn: 'Kulna Sador', nameEn: '' },
    ];
    ParDivisionList = [];
    ParDistrictList = [];
    ParUpzilaList = [];
    signImageNamePreviewUrl: any;
    profileImageNamePreviewUrl: any;
    fileToUpload1: any;
    constructor(
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private dateAdapter: DateAdapter<Date>,
        private _formBuilder: FormBuilder,
        private _toastrService: ToastrService,
        private _activatedRoute: ActivatedRoute,
        private _fileValidatorService: FileValidatorService,
        private _authService: AuthService,
        private userListService: UserListServiceService,
        private _researchProfileMultiFormService: ResearchProfileMultiFormService,
        private dialog: MatDialog,
        private smsService: SmsService,
        private _router: Router
    ) {
        // Language translations
        this._fuseTranslationLoaderService.loadTranslations(
            lngEnglish,
            lngBangla
        );
        this.dateAdapter.setLocale('en-GB'); //dd/MM/yyyy
    }
    // ngOnInit(): void {
    async ngOnInit() {
        this.uuid = this._activatedRoute.snapshot.paramMap.get('id');
        this.numberGenerator();
        if (this.uuid != null) {
            this.isUpdatedAction = true;
            await this.getDataByUuid(this.uuid);
            await this.getUserList();
        } else {
            this.isUpdatedAction = false;
            await this.getLoggedUserDetailsId();
        }
        await this.getDivisionList();
        // let info = this.userInfo.getUserData();
        // console.log('info = ', info);
        // if(info.userType == '"Rms_Researcher"'){
        // }
        //let profile= this._activatedRoute.snapshot.paramMap.get('profile');
        //console.log('profile = ', profile);
    }
    getDataByUuid(uuid: string) {
        this._researchProfileMultiFormService.profileView(uuid).subscribe(
            (data) => {
                this.uid = data.personalInfo.userId;
                this.personalInfoFormModel = data.personalInfo;
                this.personalInfoFormModel.nIDNumber =
                    data.personalInfo.nidnumber;
                this.personalInfoFormModel.tINNumber =
                    data.personalInfo.tinnumber;
                this.isVerifiedNid = data.personalInfo.nidverificationStatus;
                this.isVerifiedTin = data.personalInfo.tinverificationStatus;
                this.profileImageName =
                    data.personalInfo?.rmsUserImageId?.fileName;
                this.signImageName =
                    data.personalInfo?.rmsUserSignatureId?.fileName;
                let personalInfo = data.personalInfo.id;
                let modelName = 'researcher_profile';
                sessionStorage.removeItem('pId');
                sessionStorage.removeItem('publicationInfo');
                sessionStorage.removeItem('proExperience');
                sessionStorage.removeItem('researchExp');
                sessionStorage.removeItem('trainingInfo');
                this._researchProfileMultiFormService
                    .getNotApplicable(personalInfo, modelName)
                    .subscribe((res) => {
                        if (res.success) {
                            let objVal = res?.obj;
                            sessionStorage.setItem('pId', objVal?.id);
                            sessionStorage.setItem(
                                'publicationInfo',
                                objVal?.publicationInfo
                            );
                            sessionStorage.setItem(
                                'proExperience',
                                objVal?.proExperience
                            );
                            sessionStorage.setItem(
                                'researchExp',
                                objVal?.researchExp
                            );
                            sessionStorage.setItem(
                                'trainingInfo',
                                objVal?.trainingInfo
                            );
                        }
                    });
                if (this.personalInfoFormModel.preDivisionId) {
                    this.getDistrictByChangeDivision(
                        this.personalInfoFormModel.preDivisionId
                    );
                }
                if (this.personalInfoFormModel.divisionId) {
                    this.getDistrictByChangeDivision(
                        this.personalInfoFormModel.divisionId,
                        1
                    );
                }
                if (this.personalInfoFormModel.preDistrictId) {
                    this.getUpazilaByChangeDistrict(
                        this.personalInfoFormModel.preDistrictId
                    );
                }
                if (this.personalInfoFormModel.districtId) {
                    this.getUpazilaByChangeDistrict(
                        this.personalInfoFormModel.districtId,
                        1
                    );
                }
                this.uid = data.personalInfo.userId;
                this.getLoggedUserDetailsIdForOtp(data.personalInfo.userId);
                // console.log('personalInfoFormModel =============', this.personalInfoFormModel);
                this.checkAddressSameOrNot();
            },
            (error) => {
                console.log('Successfully not saved');
            }
        );
    }
    resetImageValue(index) {
        if (index === 0) {
            this.profileImageVariable.nativeElement.value = '';
        }
        if (index === 1) {
            this.signImageVariable.nativeElement.value = '';
        }
    }
    handleFileInput(
        files: any,
        index: number,
        maxIheight: number,
        maxIwidth: number,
        fileSizeInKB
    ) {
        console.log('files.item(0) = ', files.item(0));
        var validExt = ['jpeg', 'jpg', 'png'];
        var ext = files.item(0).name.split('.').pop();
        if (validExt.indexOf(ext.toLowerCase()) == -1) {
            this._toastrService.error('Only support jpd, jpeg and png file type','');
            this.resetImageValue(index);
            return;
        }
        this.fileToUpload1 = files.item(0);
        this._fileValidatorService.isValidateFileHeightWidth(
            (e) => {
                if (e) {
                    if (this._fileValidatorService.isValidImageSize(this.fileToUpload1,fileSizeInKB))
                        {
                        let reader = new FileReader();
                        if (index === 0) {
                            this.profileImageName = '';
                            reader.onload = (event: any) => {
                                this.profileImageNamePreviewUrl =event.target.result;
                            };
                            reader.readAsDataURL(this.fileToUpload1);
                        } else if (index === 1) {
                            this.signImageName = '';
                            reader.onload = (event: any) => {
                                this.signImageNamePreviewUrl = event.target.result;
                            };
                            reader.readAsDataURL(this.fileToUpload1);
                        }
                        this.fileToUpload.push({
                            id: index,
                            file: files.item(0),
                        });
                    } else {
                        this._toastrService.error(
                            'Image size should be less then ' +
                                fileSizeInKB / 1024 +
                                'MB',
                            ''
                        );
                    }
                } else {
                    this.resetImageValue(index);
                    this._toastrService.error(
                        'Image size should be ' +
                            maxIheight +
                            'pixel * ' +
                            maxIwidth +
                            'pixel',
                        ''
                    );
                }
            },
            files.item(0),
            maxIheight,
            maxIwidth
        );
    }
    checkRequirdField(): Boolean {
        let isValied = true;
        if (
            !this.personalInfoFormModel.fatherName ||
            !this.personalInfoFormModel.dateOfBirth ||
            !this.personalInfoFormModel.motherName ||
            !this.personalInfoFormModel.emailAddress ||
            !this.personalInfoFormModel.anotherDetails ||
            this.personalInfoFormModel.anotherDetails === '' ||
            this.personalInfoFormModel.preDivisionId === '' ||
            this.personalInfoFormModel.preDistrictId === '' ||
            this.personalInfoFormModel.preUpzilaId === '' ||
            this.personalInfoFormModel.preAnotherDetails === '' ||
            this.personalInfoFormModel.divisionId === '' ||
            this.personalInfoFormModel.districtId === '' ||
            this.personalInfoFormModel.upzilaId === ''
        ) {
            this._toastrService.warning('Please enter the required information !.','',this.config);
            isValied = false;
        }
        // this.personalInfoFormModel.forEach(f => {
        //     if (!(f.name || f.phoneNo) || !f.permanentAddress || !f.nid) {
        //         return isValied = false;
        //     }
        // });
        return isValied;
    }

    imageRequiredCheck(): boolean {
        if ((this.profileImageName && this.signImageName) ||
            (this.profileImageNamePreviewUrl && this.signImageNamePreviewUrl) ||
            (this.profileImageName && this.signImageNamePreviewUrl) ||
            (this.profileImageNamePreviewUrl && this.signImageName)
        ) {
            return true;
        } else {
            this._toastrService.warning("Select Profile and Signature Image !.")
            return false;
        }
    }

    resizeImage(imgSize) {
        window.open('/resize-image?size=' + imgSize, '_blank');
    }
    save() {
        if (this.checkRequirdField() && this.imageRequiredCheck()) {
            this.saveAndUpdate((res) => {
                    if (res) {this.getResearcherProfileByEmail((res) =>{});}
                });
        } else {
            // this._toastrService.warning('Please enter the required information !.','',this.config);
            return 0;
        }
    }
    saveAndNext() {
        if (this.checkRequirdField() && this.imageRequiredCheck()) {
            this.saveAndUpdate((res) => {
                if (res) {
                    if (!this.uuid) {
                        this.getResearcherProfileByEmail((res) => {
                            if (res) {
                                this.nextTab();
                            }
                        })
                    } else {
                        this.nextTab();
                    }
                }
            });
        } else {
            return 0;
        }
    }

    getResearcherProfileByEmail(callBack) {
        this._researchProfileMultiFormService.getResearcherProfileByEmail(this.personalInfoFormModel.emailAddress, false).subscribe(res => {
            this.uuid = res.uuid;
            let currentUrl = window.location.href;
            const newUrl = currentUrl.replace('/add', '/' + this.uuid + '/edit/' + res.id);
            history.pushState(null, null, newUrl);
            callBack(true);
        })
    }

    saveAndUpdate(callBack) {
        let fileIndex = 0;

        if(this.fileToUpload.length < 2){
            fileIndex = this.fileToUpload?.[0]?.id
        }

        if (localStorage.getItem('profilePersonalInfoUuid') != null) {
            this.uuid = localStorage.getItem('profilePersonalInfoUuid');
            this.isUpdatedAction = true;
        }
        if (!this.isUpdatedAction && !this.initSave) {
                this.personalInfoFormModel.userId =
                    this._authService.getLoggedUserId();
                this._researchProfileMultiFormService
                    .create(this.fileToUpload, this.personalInfoFormModel)
                    .subscribe(
                        (data) => {
                            localStorage.removeItem('profilePersonalInfoId');
                            localStorage.removeItem('profilePersonalInfoUuid');
                            localStorage.setItem(
                                'profilePersonalInfoId',
                                data.obj?.id
                            );
                            localStorage.setItem(
                                'profilePersonalInfoUuid',
                                data.obj.uuid
                            );
                            this.fileToUpload = [];
                            this.initSave = true;
                            this.personalInfoFormModel = data.obj;
                            this.personalInfoFormModel.nIDNumber =
                                data.obj.nidnumber;
                            this.personalInfoFormModel.tINNumber =
                                data.obj.tinnumber;
                            this._toastrService.success(data.message, '', this.config);
                            callBack(true);
                        },
                        (error) => {
                            this._toastrService.error('Save unsuccessful','',this.config);
                        }
                    );
        } else {
                this.personalInfoFormModel.uuid = this.uuid;
                this.personalInfoFormModel.userId = this._authService.getLoggedUserId();
                if (this.fileToUpload.length < 1) {
                    this.fileToUpload.push({ id: 0, file: new File([], 'filename') });
                    fileIndex = 3;
                }
                this._researchProfileMultiFormService.update(this.uuid,this.fileToUpload, fileIndex, this.personalInfoFormModel)
                    .subscribe(
                        (data) => {
                            localStorage.setItem('profilePersonalInfoId',data.obj.id);
                            this.fileToUpload = [];
                            this._toastrService.success( data.message, '', this.config );
                            callBack(true);
                        },
                        (error) => {
                            this._toastrService.error( 'Save unsuccessful', '', this.config);
                        }
                    );
        }
    }
    test() {
        alert('hi');
    }
    //age calculator
    ageCalculator() {
        if (this.personalInfoFormModel.dateOfBirth) {
            const convertAge = new Date(this.personalInfoFormModel.dateOfBirth);

            if (new Date(convertAge).getTime() > this.todayDate.getTime()) {
                this.personalInfoFormModel.dateOfBirth = null;
                this._toastrService.error( 'Please enter previous date', '', this.config);
            }
            else{
                const timeDiff = Math.abs(Date.now() - convertAge.getTime());
                this.personalInfoFormModel.age = Math.floor(
                    timeDiff / (1000 * 3600 * 24) / 365
                );
            }

        }
    }
    numberGenerator() {
        for (let i = 0; i <= 100; i++) {
            this.researchNo.push({
                id: i.toString(),
            });
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
    nidVerification() {}
    tinVerification() {}
    getUserList() {
        this.userListService.getAllUser().subscribe((res) => {
            this.userList = res ? res : [];
            this.userList.forEach((element) => {
                if (element.id === this.personalInfoFormModel.userId) {
                    this.personalInfoFormModel.userId = element.name;
                }
            });
        });
    }
    private getLoggedUserDetailsIdForOtp(id) {
        this._authService.getUserDetailsById(id).subscribe((data) => {
            this.isPhoneVerified = data.phoneIsVerified;
            this.researcherName = data?.name ? data?.name : '';
        });
    }
    private getLoggedUserDetailsId() {
        this._authService.getLoggedUserDetailsById().subscribe((data) => {
            this.uid = data.id;
            this.isPhoneVerified = data.phoneIsVerified
                ? data.phoneIsVerified
                : false;
            //console.log(this.isPhoneVerified)
            this.personalInfoFormModel.userId =
                this._authService.getLoggedUserId();
            this.personalInfoFormModel.mobileNo = data.mobileNumber;
            this.personalInfoFormModel.emailAddress = data.emailId;
            this.researcherName = data?.name ? data?.name : '';
        });
    }
    // ParDivisionList = [];
    // ParDistrictList = [];
    // ParUpzilaList = [];
    getDivisionList() {
        this.divisionList = [];
        this._researchProfileMultiFormService
            .getDivisionList()
            .subscribe((data) => {
                // console.log('data', data);
                if (data.items.length > 0) {
                    this.divisionList = data.items;
                    this.ParDivisionList = data.items;
                }
            });
    }
    getDistrictByChangeDivision(divisionId, forVal = 0) {
        if (forVal == 0) {
            this.districtList = [];
            this._researchProfileMultiFormService
                .getDistrictListByDivisionId(divisionId)
                .subscribe((data) => {
                    if (data.items.length > 0) {
                        this.districtList = data.items;
                    }
                });
        } else {
            this.ParDistrictList = [];
            this._researchProfileMultiFormService
                .getDistrictListByDivisionId(divisionId)
                .subscribe((data) => {
                    if (data.items.length > 0) {
                        this.ParDistrictList = data.items;
                    }
                });
        }
    }
    //   eee
    getUpazilaByChangeDistrict(districtId, forVal = 0) {
        if (forVal == 0) {
            this.upzilaList = [];
            this._researchProfileMultiFormService
                .getUpazilaListByDistrictId(districtId)
                .subscribe((data) => {
                    if (data.items.length > 0) {
                        this.upzilaList = data.items;
                    }
                });
        } else {
            this.ParUpzilaList = [];
            this._researchProfileMultiFormService
                .getUpazilaListByDistrictId(districtId)
                .subscribe((data) => {
                    if (data.items.length > 0) {
                        this.ParUpzilaList = data.items;
                    }
                });
        }
    }
    titleCaseWord(word: string) {
        if (!word) return word;
        return word[0].toUpperCase() + word.substr(1).toLowerCase();
    }
    isBothAddressSame(event: MatCheckboxChange) {
        if (event.checked) {
            if (this.personalInfoFormModel.preDivisionId) {
                this.getDistrictByChangeDivision(
                    this.personalInfoFormModel.preDivisionId,
                    1
                );
            }
            if (this.personalInfoFormModel.preDistrictId) {
                this.getUpazilaByChangeDistrict(
                    this.personalInfoFormModel.preDistrictId,
                    1
                );
            }
            this.personalInfoFormModel.divisionId =
                this.personalInfoFormModel.preDivisionId;
            this.personalInfoFormModel.districtId =
                this.personalInfoFormModel.preDistrictId;
            this.personalInfoFormModel.upzilaId =
                this.personalInfoFormModel.preUpzilaId;
            this.personalInfoFormModel.anotherDetails =
                this.personalInfoFormModel.preAnotherDetails;
        } else {
            this.personalInfoFormModel.divisionId = null;
            this.personalInfoFormModel.districtId = null;
            this.personalInfoFormModel.upzilaId = null;
            this.personalInfoFormModel.anotherDetails = null;
        }
    }
    PhoneVerification() {
        this.otpValidation(this.uid);
    }
    otpValidation(userId: any) {
        /*
         * Need To generate Otp via feign call
         * */
        this.smsService.sendOtp(userId).subscribe((otpRes) => {
            if (otpRes.status) {
                this._toastrService.success(otpRes.message);
            }
        });
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = false;
        dialogConfig.width = ConfirmDialogConstant.WIDTH_OTP_MODAL;
        dialogConfig.height = ConfirmDialogConstant.HEIGHT;
        dialogConfig.panelClass = ConfirmDialogConstant.PANEL_CLASS;
        dialogConfig.data = { message: ConfirmDialogConstant.OTP };
        const dialogRef = this.dialog.open(OtpComponent, dialogConfig);
        dialogRef.componentInstance.closeEventEmitter.subscribe((res) => {
            /*
             * for Resend Otp*/
            if (res[0].rs) {
                this.smsService
                    .resendOtp(parseInt(userId))
                    .subscribe((ores) => {
                        if (ores.status) {
                            this._toastrService.success(ores.message);
                        } else {
                            this._toastrService.warning(ores.message);
                        }
                    });
            } else {
                if (res[0].status) {
                    const otpData =
                        res[0].car1 +
                        '' +
                        res[0].car2 +
                        '' +
                        res[0].car3 +
                        '' +
                        res[0].car4;
                    const data: any = {
                        otp: parseInt(otpData),
                        userId: parseInt(userId),
                    };
                    this.smsService.verifyOtp(data).subscribe((otpRes) => {
                        if (otpRes.status) {
                            this._toastrService.success(otpRes.message);
                            this.isPhoneVerified = otpRes.status;
                            if (otpRes.status) {
                                dialogRef.close(true);
                            }
                        } else {
                            this._toastrService.warning(otpRes.message);
                        }
                    });
                }
                if (res[0].cl) {
                    dialogRef.close(true);
                }
            }
        });
    }

    checkAddressSameOrNot() {
        if (this.personalInfoFormModel.divisionId == this.personalInfoFormModel.preDivisionId &&
        this.personalInfoFormModel.districtId == this.personalInfoFormModel.preDistrictId &&
        this.personalInfoFormModel.upzilaId == this.personalInfoFormModel.preUpzilaId &&
        this.personalInfoFormModel.anotherDetails == this.personalInfoFormModel.preAnotherDetails) {
            this.sameAddressCheckbox.checked = true;
        }

    }

}
