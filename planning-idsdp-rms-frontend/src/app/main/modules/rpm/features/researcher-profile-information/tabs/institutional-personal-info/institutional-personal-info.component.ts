import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { ActivatedRoute } from '@angular/router';
import { FuseTranslationLoaderService } from 'app/main/core/services/translation-loader.service';
import { AuthService } from 'app/main/modules/auth/services/auth.service';
import {
    addNewIcon,
    nextIcon,
    previousIcon,
    refreshIcon,
    saveIcon
} from 'app/main/modules/rpm/constants/button.constants';
import { PersonalInfoFormModel } from 'app/main/modules/rpm/models/PersonalInfoFormModel';
import { ResearcherProposalInstitutionInformation } from 'app/main/modules/rpm/models/ResearcherProposalInstitutionInformation';
import { DivisionDistrictUpzilaService } from 'app/main/modules/rpm/services/division-district-upzila.service';
import { FileValidatorService } from 'app/main/modules/rpm/services/file-validator.service';
import { ResearchProfileMultiFormService } from 'app/main/modules/rpm/services/research-profile-multi-form.service';
import { UserListServiceService } from 'app/main/modules/settings/services/user-list-service.service';
import { FileUploadService } from 'app/main/shared/services/file-upload.service';
import { ToastrService } from 'ngx-toastr';
import { locale as lngBangla } from './i18n/bn';
import { locale as lngEnglish } from './i18n/en';

@Component({
    selector: 'app-institutional-personal-info',
    templateUrl: './institutional-personal-info.component.html',
    styleUrls: ['./institutional-personal-info.component.scss']
})
export class InstitutionalPersonalInfoComponent implements OnInit {

    spinner: boolean;
    institutionInformation: ResearcherProposalInstitutionInformation = new ResearcherProposalInstitutionInformation();

    canSave: boolean;
    years: any[] = [];
    tabData: any;

    /*----Button---*/
    refreshIcon = refreshIcon;
    saveIcon = saveIcon;
    previousIcon = previousIcon;
    addNewIcon = addNewIcon;
    nextIcon = nextIcon;

    /*----/Button---*/
    file: File;

    @Output() nextStep = new EventEmitter<boolean>();
    @Output() backPrevious = new EventEmitter<boolean>();
    @ViewChild('myForm') mytemplateForm: FormBuilder;
    fileToUpload: { id: number, file: File }[] = [];


    researchNo = new Array<{
        id: string;
    }>();

    config: { timeOut: 5000; closeButton: true; positionClass: 'toast-top-right'; enableHtml: true; };
    personalInfoFormModel: PersonalInfoFormModel = new PersonalInfoFormModel();

    isUpdatedAction: boolean;
    isVerifiedNid: boolean = false;
    isVerifiedTin: boolean = false;
    profileImageName: string = null;
    signImageName: string = null;
    IncomeTaxFileName: string = null;
    userList: any[] = [];
    uuid: string;
    marks: number[] = [];
    selectNum = new Array<{
        id: number;
    }>();
    signImageNamePreviewUrl: any;
    profileImageNamePreviewUrl: any;
    fileToUpload1: any;
    bankNameList = [];
    frmGroup: FormGroup;
    holdImageData = [];

    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private dateAdapter: DateAdapter<Date>,
        private _toastrService: ToastrService,
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,
        private userListService: UserListServiceService,
        private _researchProfileMultiFormService: ResearchProfileMultiFormService,
        private DividionDU: DivisionDistrictUpzilaService,
        private formBuilder: FormBuilder,
        private _fileValidatorService: FileValidatorService,
        private _fileUploadService: FileUploadService
        ) {
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
        this.dateAdapter.setLocale('en-GB'); //dd/MM/yyyy
    }

    ngOnInit(): void {
        this.frmGroup = this.formBuilder.group({
            keyWord: ['']
          });

        const currentYear = new Date().getFullYear();
        for (let i = 1950; i <= currentYear; i++) {
            this.years.push({ year: i });
        }

        this.uuid = this._activatedRoute.snapshot.paramMap.get('id');
        this.numberGenerator();
        this.selectNum = this.selectNumGenerator(0, 20, this.selectNum);
        let mark = 1;
        while (mark < 21) {
            this.marks.push(mark);
            mark += 1;
        }

        if (this.uuid != null) {
            this.isUpdatedAction = true;
            this.getUserList(() => {
                this.getDataByUuid(this.uuid)
            });
        } else {
            this.isUpdatedAction = false;
            this.getLoggedUserDetailsId();
        }
        this.onInitData();
        this.getBankNameList();

    }

    getResearcherProfileByEmail(callBack) {
        this._researchProfileMultiFormService.getResearcherProfileByEmail(this.personalInfoFormModel.emailAddress, true).subscribe(res => {
            this.uuid = res.uuid;
            let currentUrl = window.location.href;
            const newUrl = currentUrl.replace('/add', '/' + this.uuid + '/edit/' + res.id);
            history.pushState(null, null, newUrl);
            callBack(true);
        })
    }

    getDataByUuid(uuid: string) {        
        this._researchProfileMultiFormService.profileView(uuid).subscribe(data => {
            this.getLoggedUserDetailsId();
            this.personalInfoFormModel = data.personalInfo;
            this.personalInfoFormModel.instYearOfEstablishment = Number(this.personalInfoFormModel.instYearOfEstablishment);
            this.personalInfoFormModel.nIDNumber = data.personalInfo.nidnumber;
            this.personalInfoFormModel.tINNumber = data.personalInfo.tinnumber;
            this.isVerifiedNid = data.personalInfo.nidverificationStatus;
            this.isVerifiedTin = data.personalInfo.tinverificationStatus;
            this.IncomeTaxFileName = data.personalInfo.researcherProfileUploadAcknowledgementIncomeTaxId ? data.personalInfo.researcherProfileUploadAcknowledgementIncomeTaxId.fileName : '';

            let personalInfo = data.personalInfo.id;            
            let modelName = "researcher_profile";
            sessionStorage.removeItem("pId");
            sessionStorage.removeItem("publicationInfo");
            sessionStorage.removeItem("proExperience");
            sessionStorage.removeItem("researchExp");
            sessionStorage.removeItem("trainingInfo");
            this._researchProfileMultiFormService.getNotApplicable(personalInfo, modelName).subscribe(res => {
                if(res.success){
                    let objVal = res?.obj
                    sessionStorage.setItem('pId', objVal?.id);
                    sessionStorage.setItem('publicationInfo', objVal?.publicationInfo);
                    sessionStorage.setItem('proExperience', objVal?.proExperience);
                    sessionStorage.setItem('researchExp', objVal?.researchExp);
                    sessionStorage.setItem('trainingInfo', objVal?.trainingInfo);
                }
            })

        }, error => {
            console.log('Successfully not saved');
        });
    }

    getBankNameList(){
        this.DividionDU.getBankNameList().subscribe(res => {
            if (Array.isArray(res)) {
             this.bankNameList = res;
            }
        })
    }
    saveAndUpdate(callBack) {

        this.spinner = true;

        if (!this.personalInfoFormModel.id) {
            // this.onSave();
            this.personalInfoFormModel.userId = this._authService.getLoggedUserId();
            this.personalInfoFormModel.isInstitutional = true;
            this._researchProfileMultiFormService.saveResearcherProfilePersonalInstitutionalInfo(this.personalInfoFormModel, this.file).subscribe(
                data => {

                    localStorage.setItem("profilePersonalInfoId", data.obj.id);
                    this.fileToUpload = [];
                    this.getDataByUuid(data.obj.uuid);
                    this._toastrService.success(data.message, "", this.config);
                    this.spinner = false;
                    callBack(true)
                },
                error => {
                    this._toastrService.error("Save unsuccessful", "", this.config);
                    this.spinner = false;
                });
        } else {
            // this.onUpdate();
            this.personalInfoFormModel.userId = this._authService.getLoggedUserId();
            this.personalInfoFormModel.isInstitutional = true;
            this.spinner = true;
            this._researchProfileMultiFormService.updateResearcherProfilePersonalInstitutionalInfo(this.personalInfoFormModel, this.file, this.uuid).subscribe(
                data => {

                    localStorage.setItem("profilePersonalInfoId", data.obj.id);
                    this.fileToUpload = [];
                    this.getDataByUuid(data.obj.uuid);
                    this._toastrService.success(data.message, "Success!", this.config);
                    this.spinner = false;
                    callBack(true)
                },
                error => {
                    this._toastrService.error("Save unsuccessful", "", this.config);
                    this.spinner = false;
                });
        }
    }

    onSave() {
        this.spinner = true;
        this.personalInfoFormModel.userId = this._authService.getLoggedUserId();
        this.personalInfoFormModel.isInstitutional = true;
        this._researchProfileMultiFormService.saveResearcherProfilePersonalInstitutionalInfo(this.personalInfoFormModel, this.file).subscribe(
            data => {

                localStorage.setItem("profilePersonalInfoId", data.obj.id);
                this.fileToUpload = [];
                this.getDataByUuid(data.obj.uuid);
                this._toastrService.success(data.message, "", this.config);
                this.spinner = false;
            },
            error => {
                this._toastrService.error("Save unsuccessful", "", this.config);
                this.spinner = false;
            });
    }

    onUpdate() {
        this.personalInfoFormModel.userId = this._authService.getLoggedUserId();
        this.personalInfoFormModel.isInstitutional = true;
        this.spinner = true;
        this._researchProfileMultiFormService.updateResearcherProfilePersonalInstitutionalInfo(this.personalInfoFormModel, this.file, this.uuid).subscribe(
            data => {

                localStorage.setItem("profilePersonalInfoId", data.obj.id);
                this.fileToUpload = [];
                this.getDataByUuid(data.obj.uuid);
                this._toastrService.success(data.message, "Success!", this.config);
                this.spinner = false;
            },
            error => {
                this._toastrService.error("Save unsuccessful", "", this.config);
                this.spinner = false;
            });
    }

    numberGenerator() {
        for (let i = 1; i <= 100; i++) {
            this.researchNo.push({
                id: i.toString()
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

    FinallySave(next) {

        let result = true;

        if (this.personalInfoFormModel.bankMobileNumber) {
            let text = this.personalInfoFormModel.bankMobileNumber;
            let pattern = /^((\\+91-?)|0)?[0-9]{10}$/;
            result = pattern.test(text);
            if (!result) {
                this._toastrService.warning("Bank Mobile number is not valid !.", "", this.config);
            }
        }

        if (!result) {
            return;
        }

        this.saveAndUpdate((res) => {
            if (res) {
                this.getResearcherProfileByEmail((res) => {
                    if (res) {
                        if (next) {
                            this.nextTab();
                        }
                    }
                })
            }
        });

    }

    saveAndNext(next = false) {
        if (!this.checkRequirdField()) {
            this._toastrService.warning("Please enter the required information !.", "", this.config);
            return;
        }
        if(this.holdImageData?.length > 0){
            this.holdImageData.forEach((val, i) => {
                this.UploadToMinio(val.file, (res) => {
                    if (res == true && i + 1 == this.holdImageData.length) {
                        this.FinallySave(next);
                    }
                });
            });
        }
        else{
            this.FinallySave(next);
        }

    }

    UploadToMinio(files, callback) {
        this._fileUploadService.uploadFile(files[0], files[0].name, 'rms').subscribe((data) => {
                if (data) {
                    this.personalInfoFormModel.fileDownloadUrl =data?.downloadUrl;
                    this.personalInfoFormModel.bucketName = data?.bucketName;
                    this.personalInfoFormModel.fileName = data?.fileName;
                    callback(true);
                }
                callback(false);
            });
    }

    uploadFile(file: FileList, forImg='TokenImage') {
        /*_____________File Extension and File Size Validation ______________*/
        var validExt = ['pdf', 'jpg', 'jpeg', 'png'];
        var isExtension = this._fileValidatorService.checkFileExtension(file,validExt);
        if (!isExtension) {
            this._toastrService.error('You can upload only pdf, jpg, jpeg and png file','');
            return;
        }
        var needFileSize = 1; //MB
        var isSize = this._fileValidatorService.checkUploadFileSize(file, needFileSize);
        if (!isSize) {
            this._toastrService.error(
                'File size should be less then or equal ' + needFileSize + 'MB',
                ''
            );
            return;
        }
        /*_____________/File Extension and File Size Validation ______________*/
        if(forImg == 'TokenImage'){
            this.file = file.item(0);
        }
        if(forImg == 'CheckImage'){
            this.holdImageData.push({file: file.item(0) ? file : ''});
        }
    }

    getUserList(callback) {
        this.userListService.getAllUser().subscribe(
            res => {
                this.userList = res ? res : [];
                callback(true);
            }
        );
    }

    private getLoggedUserDetailsId() {        
        this._authService.getLoggedUserDetailsById().subscribe(data => {
            this.personalInfoFormModel.userId = data.name;
            this.personalInfoFormModel.mobileNo = data.mobileNumber;
            this.personalInfoFormModel.emailAddress = data.emailId;
        });
    }


    titleCaseWord(word: string) {
        if (!word) return word;
        return word[0].toUpperCase() + word.substr(1).toLowerCase();
    }


    onInitData() {
        this.personalInfoFormModel.dateOfBirth = new Date();
        this.personalInfoFormModel.age = 0;
        this.personalInfoFormModel.fatherName = '';
        this.personalInfoFormModel.motherName = '';
        this.personalInfoFormModel.researchTraining = '';
        this.personalInfoFormModel.nIDNumber = '';
        this.personalInfoFormModel.nIDVerificationStatus = '';
        this.personalInfoFormModel.tINVerificationStatus = '';
        this.personalInfoFormModel.occupation = '';
        this.personalInfoFormModel.designation = '';
        this.personalInfoFormModel.totalResearcherNumbers = '';
        this.personalInfoFormModel.preDivisionId = 0;
        this.personalInfoFormModel.preDistrictId = 0;
        this.personalInfoFormModel.preUpzilaId = 0;
        this.personalInfoFormModel.preAnotherDetails = '';
        this.personalInfoFormModel.divisionId = 0;
        this.personalInfoFormModel.districtId = 0;
        this.personalInfoFormModel.upzilaId = 0;
        this.personalInfoFormModel.anotherDetails = '';
        this.personalInfoFormModel.detailsPresentAddress = '';
        this.personalInfoFormModel.isPending = true;
        this.personalInfoFormModel.isDraftApproval = true;
        this.personalInfoFormModel.isFinalApproval = true;
    }


    selectNumGenerator(startPoint: number, range: number, type: any): any {
        for (startPoint; startPoint <= range; startPoint++) {
            type.push({
                id: startPoint
            });
        }
        return type;
    }


    // findUserName(){

    // }


    checkRequirdField(): Boolean {
        let isValied = true;
        if (!this.personalInfoFormModel.instYearOfEstablishment
            // || !this.personalInfoFormModel.instTelephoneNo
            || !this.personalInfoFormModel.instAddressDetails
            || !this.personalInfoFormModel.emailAddress
            || !this.personalInfoFormModel.instHeadName
            // || !this.personalInfoFormModel.nidNo
            || !this.personalInfoFormModel.bankName
            // || !this.personalInfoFormModel.accountNumber
        ) {
            isValied = false;
        }
        return isValied;
    }

}
