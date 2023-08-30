import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FuseTranslationLoaderService } from "../../../../../../core/services/translation-loader.service";
import { locale as lngEnglish } from "../../i18n/en";
import { locale as lngBangla } from "../../i18n/bn";
import { EducationInfoFormModel } from "../../../../models/EducationInfoFormModel";
import { ResearchProfileMultiFormService } from "../../../../services/research-profile-multi-form.service";
import { ToastrService } from "ngx-toastr";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import { MatSelectChange } from '@angular/material/select';
import {
    addNewIcon,
    nextIcon,
    previousIcon,
    refreshIcon,
    saveIcon
} from 'app/main/modules/rpm/constants/button.constants';
import { degree } from 'app/main/modules/rpm/constants/degree.constant';
import { FileUploadService } from "../../../../../../shared/services/file-upload.service";
import { FileUploadModel } from "../../../../../training-institute/models/e-nothi.model";
import { UtilsService } from "../../../../../training-institute/services/utils.service";
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmDialogConstant } from 'app/main/shared/constant/confirm.dialog.constant';
import { SubmitConfirmationDialogComponent } from 'app/main/shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component';
import { Location } from '@angular/common';

@Component({
    selector: 'app-education-info',
    templateUrl: './education-info.component.html',
    styleUrls: ['./education-info.component.scss']
})
export class EducationInfoComponent implements OnInit {

    @Output() nextStep = new EventEmitter<boolean>();
    @Output() backPrevious = new EventEmitter<boolean>();

    educationInfoFormModelList: EducationInfoFormModel[] = [];
    certificateFiles: File[] = new Array();

    diisionList: [] = [];
    passingYearList = new Array<{
        year: any;
    }>();

    degreeList = degree;
    cgpaIsDisable: { index: number, isDisabled: boolean } = { index: 0, isDisabled: false };

    config: { timeOut: 5000; closeButton: true; positionClass: 'toast-top-right'; enableHtml: true; };

    isUpdatedAction: boolean;
    isVerifiedNid: boolean = false;
    isVerifiedTin: boolean = false;
    uuid: string;
    id: number;
    /*----Button---*/
    refreshIcon = refreshIcon;
    saveIcon = saveIcon;
    previousIcon = previousIcon;
    addNewIcon = addNewIcon;
    nextIcon = nextIcon;
    /*----/Button---*/
    divisionClassOrCgpa: number;
    imageName: any;
    holdImageData: any;
    smallScreen = (localStorage.getItem('smallScreen')) ? JSON.parse(localStorage.getItem('smallScreen')) : 0;
    imgSpinner: boolean = false;

    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _formBuilder: FormBuilder,
        private _toastrService: ToastrService,
        private _activatedRoute: ActivatedRoute,
        private _fileUploadService: FileUploadService,
        private _researchProfileMultiFormService: ResearchProfileMultiFormService,
        private fileUtils: UtilsService,
        private matDialog: MatDialog,
        private _location: Location
    ) {
        // Language translations
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla)
            ;

        //Set Default
        this.addNewForm();
    }

    ngOnInit(): void {
        this.uuid = this._activatedRoute.snapshot.paramMap.get('id');
        this.id = +(this._activatedRoute.snapshot.paramMap.get('uid'));
        if (this.uuid != null) {
            this.isUpdatedAction = true;
            this.getDataByUuid(this.uuid)
        } else {
            this.isUpdatedAction = false;
        }
        this.getDivisions();
        this.yearGenerator();
        //this.divisionClassOrCgpa = 1
        setTimeout(() => { this.divisionClassOrCgpa = 1 }, 100);
    }
    ImageSpliter(file: string) {
        return this.fileUtils.imageNameSpliter(file + '', '-', 0);
    }

    getDataByUuid(uuid: string) {
        this._researchProfileMultiFormService.profileView(uuid).subscribe(data => {
            if(data?.educationInfos?.length > 0) {
                this.educationInfoFormModelList = data.educationInfos;
            }

        }, error => {
            console.log('Successfully not saved');

        })
    }

    checkRequirdField(): Boolean {
        let isValied = true;
        this.educationInfoFormModelList.forEach(f => {
            if (f.certificationName === '' ||
                !f.instituteName
                || f.passingYearMonth === '') {
                return isValied = false;
            }
        });
        return isValied;
    }


    save() {

        if (!this.id) {
            const pathSegments = this._location.path().split('/');
            this.uuid = pathSegments[2];
            this.id = +pathSegments[4];
        }
        if (!this.id) {
            this._toastrService.error('Personal information save first');
            return;
        }

        if (!this.checkRequirdField()) {
            this._toastrService.warning("Please enter the required information !.", "", this.config);
            return;
        }

        if (localStorage.getItem("profilePersonalInfoId") != null) {
            this.id = +(localStorage.getItem("profilePersonalInfoId"));
            this.isUpdatedAction = true;
        }

        this._researchProfileMultiFormService.saveOrUpdateEducation(this.educationInfoFormModelList, this.id).subscribe(res => {
            if (res.success) {
                this._toastrService.success('Saved  successfully!', "", this.config);
                this.educationInfoFormModelList = res.items;
            }
        }, error => {
            this._toastrService.error("Save unsuccessful", "", this.config);
            console.log(error)
        })




    }

    saveAndNext() {
        if (!this.checkRequirdField()) {
            this._toastrService.warning("Please enter the required information !.", "", this.config);
            return;
        }
        this.save();
        this.nextTab();
    }

    handleFileInput(file: FileList, index: number) {
        this.certificateFiles.push(file.item(0))

        // console.log(this.certificateFiles)
        // console.log(index)
    }




    addNewForm() {

        this.educationInfoFormModelList.push(
            {
                id: null,
                uuid: null,
                profilePersonalInfoId: null,
                certificationName: '',
                passingYearMonth: '',
                division: '',
                scale: '',
                cgpa: '',
                instituteName: '',
                isForeign: false,
                uploadCertificateImage: '',
                universityRegNo: '',
                discipline: '',
                isEditable: false,
                divisionClassOrCgpa: null,
                // certificateImage: null,
                registrationNo: '',
                subject: '',
                thesisGroup: 1,
                fileUploadModel: new FileUploadModel(),
                isDeleted: false,
                createdOn: null,
                updatedBy: null,
                updatedOn: null,
                superviserInformation: '',
            }
        )
       // console.log("this.educationInfoFormModelList = ", this.educationInfoFormModelList)
    }

    deleteFormByIndex(index: number) {
        let educationInfoFormModels = this.educationInfoFormModelList.filter(f => f.isDeleted === false);
        if (educationInfoFormModels.length === 1) {
            this._toastrService.info("At least One field Needed ");
        } else {
            if (!this.educationInfoFormModelList[index].id) {
                this.educationInfoFormModelList.splice(index, 1)
            } else {
                this.openDialog(index);
                // this.educationInfoFormModelList[index].isDeleted = true;
            }
        }


    }

    //get divisions list

    getDivisions() {
        this._researchProfileMultiFormService.getDivisions().subscribe(data => {
            this.diisionList = data;
        }, error => {

        });
    }

    yearGenerator() {
        const currentYear = new Date().getFullYear();
        for (let i = 1950; i <= currentYear; i++) {
            this.passingYearList.push({ year: i.toString() });
        }
    }

    enableCgpa($event: MatSelectChange, i: number) {
        let status = $event.value
        if (status === 'CGPA') {
            this.cgpaIsDisable = { index: i, isDisabled: true };
        } else {
            this.cgpaIsDisable = { index: i, isDisabled: false };
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


    onChangeCgpaOrDgree(index) {

    }

    uploadFile(files: FileList, tag: string, index) {
        this.imageName = null;
        this.imgSpinner = true;
        if (tag === 'certificate_image') {
            this.UploadToMinio(files, res => {
                if (res) {
                    this.setFileDetails(index, this.holdImageData);
                    this.imgSpinner = false;
                }
            })
        }

    }

    UploadToMinio(files, callback) {
        this.imageName = null;
        this._fileUploadService.uploadFile(files[0], files[0].name, 'rms').subscribe(data => {
            if (data) {
                this.holdImageData = data;
                callback(true);
            }
        }, error => {
            callback(false)
        })
        callback(false)
    }


    setFileDetails(index, data) {
        let fileUploadModel = new FileUploadModel();
        fileUploadModel.fileName = data.fileName;
        fileUploadModel.bucketName = data.bucketName;
        fileUploadModel.downloadUrl = data.downloadUrl;
        this.educationInfoFormModelList[index].fileUploadModel = fileUploadModel;
    }


    private openDialog(i) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = false;
        dialogConfig.width = ConfirmDialogConstant.WIDTH;
        dialogConfig.height = ConfirmDialogConstant.HEIGHT;
        dialogConfig.panelClass = ConfirmDialogConstant.PANEL_CLASS;
        dialogConfig.data = { message: ConfirmDialogConstant.MESSAGE };
        const dialogRef = this.matDialog.open(SubmitConfirmationDialogComponent, dialogConfig);

        dialogRef.componentInstance.closeEventEmitter.subscribe(res => {
            if (res) {
                this.educationInfoFormModelList[i].isDeleted = true;
                this.save();
            }
            dialogRef.close(true);
        });
    }



}
