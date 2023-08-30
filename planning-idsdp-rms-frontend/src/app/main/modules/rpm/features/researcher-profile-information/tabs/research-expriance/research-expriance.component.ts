import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder } from "@angular/forms";
import { FuseTranslationLoaderService } from "../../../../../../core/services/translation-loader.service";
import { locale as lngEnglish } from "../../i18n/en";
import { locale as lngBangla } from "../../i18n/bn";
import { ResearchExprienceFormModel } from "../../../../models/ResearchExprienceFormModel";
import { ResearchProfileMultiFormService } from "../../../../services/research-profile-multi-form.service";
import { ToastrService } from "ngx-toastr";
import { ActivatedRoute } from "@angular/router";
import {
    addNewIcon,
    nextIcon,
    previousIcon,
    refreshIcon,
    saveIcon
} from 'app/main/modules/rpm/constants/button.constants';
import { MIN_EDITOR_CONFIG } from 'app/main/core/constants/editor-config';
import { FileUploadService } from 'app/main/shared/services/file-upload.service';
import { FileUploadModel } from 'app/main/modules/training-institute/models/e-nothi.model';
import { UtilsService } from 'app/main/modules/training-institute/services/utils.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmDialogConstant } from 'app/main/shared/constant/confirm.dialog.constant';
import { SubmitConfirmationDialogComponent } from 'app/main/shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component';
import { RmsProfileNotApplicable } from 'app/main/modules/rpm/models/notApplicable/RmsProfileNotApplicable';
import { FileValidatorService } from 'app/main/modules/rpm/services/file-validator.service';
import { Location } from '@angular/common';

@Component({
    selector: 'app-research-expriance',
    templateUrl: './research-expriance.component.html',
    styleUrls: ['./research-expriance.component.scss']
})
export class ResearchExprianceComponent implements OnInit {

    @Output() nextStep = new EventEmitter<boolean>();
    @Output() backPrevious = new EventEmitter<boolean>();

    researchExprienceFormModelList: ResearchExprienceFormModel[] = new Array();

    config: { timeOut: 5000; closeButton: true; positionClass: 'toast-top-right'; enableHtml: true; };

    rmsProfileNotApplicable = new RmsProfileNotApplicable();
    isUpdatedAction: boolean;
    isVerifiedNid: boolean = false;
    isVerifiedTin: boolean = false;
    minEditorConfig: any = MIN_EDITOR_CONFIG;

    id: number;

    /*----Button---*/
    refreshIcon = refreshIcon;
    saveIcon = saveIcon;
    previousIcon = previousIcon;
    addNewIcon = addNewIcon;
    nextIcon = nextIcon;
    /*----/Button---*/

    imageName: any;
    holdImageData: any;
    profileId: any;

    researchObjectiveFiles: File[] = new Array();

    imgSpinner: boolean = false;

    researchExpLength = 0;
    isApplicable: number = 2;

    @Input() set rNotApplicable(value: any) {
        if(value !== undefined && value !== NaN && value != 0  && value <= 2){
            this.isApplicable = (this.researchExpLength>0) ? 2 : value;
        }
    }

    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _formBuilder: FormBuilder,
        private _toastrService: ToastrService,
        private _activatedRoute: ActivatedRoute,
        private _researchProfileMultiFormService: ResearchProfileMultiFormService,
        private _fileUploadService: FileUploadService,
        private fileUtils: UtilsService,
        private matDialog: MatDialog,
        private fileValidatorService: FileValidatorService,
        private _location: Location
    ) {
        // Language translations
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);

        //Set Default
        this.addNewForm();
    }

    ngOnInit(): void {
        const uuid = this._activatedRoute.snapshot.paramMap.get('id');
        this.id = +(this._activatedRoute.snapshot.paramMap.get('uid'));
        if (uuid != null) {
            this.isUpdatedAction = true;
            this.getDataByUuid(uuid)
        } else {
            this.isUpdatedAction = false;
        }
    }

    handleFileInput(file: FileList, index: number) {
        this.researchObjectiveFiles = [];
        if (this.researchObjectiveFiles?.[index] !== undefined) {
            this.researchObjectiveFiles.splice(index, 0, file.item(0));
        }
        else {
            for (var i = 0; i <= index; i++) {
                if (i == index) {
                    this.researchObjectiveFiles.splice(index, 0, file.item(0));
                } else {
                    var f = new File([""], "");
                    this.researchObjectiveFiles.push(f);
                }
                //this.researchObjectiveFiles.push(file.item(0))
            }
        }
        //this.researchObjectiveFiles.splice(index, 0, file.item(0));
        //console.log('this.researchObjectiveFiles = ', this.researchObjectiveFiles)
        // console.log(index)
    }

    getDataByUuid(uuid: string) {
        this._researchProfileMultiFormService.profileView(uuid).subscribe(data => {
            this.researchExprienceFormModelList = (data.researchExperiences && data.researchExperiences.length > 0) ? data.researchExperiences : [];
            if (!this.researchExprienceFormModelList || this.researchExprienceFormModelList.length < 1) {
                this.addNewForm();
            }
            this.researchExpLength = data.researchExperiences.length
            this.isApplicable = (this.researchExprienceFormModelList.length > 0) ? 2 : 1;
        }, error => {
            console.log('Successfully not saved');
        });
    }

    // save2() {
    //     if(localStorage.getItem("profilePersonalInfoId") != null)
    //     {
    //         this.id = +(localStorage.getItem("profilePersonalInfoId"));
    //         this.isUpdatedAction = true;
    //     }
    //     this.researchExprienceFormModelList = this.researchExprienceFormModelList.map(m => {
    //         m.profilePersonalInfoId = this.id;
    //         m.isDeleted = m.isDeleted ? 1 : 0;
    //         return m;
    //     });
    // if (!this.isUpdatedAction) {
    //         this._researchProfileMultiFormService.saveResearcherExperience(this.researchExprienceFormModelList, this.researchObjectiveFiles, 'ResearchExpriance').subscribe(data => {
    //             console.log('Successfully saved')
    //             if (data.success) {
    //                 this._toastrService.success(data.message, "", this.config);
    //             } else {
    //                 this._toastrService.error(data.message, "", this.config);
    //             }

    //         }, error => {
    //             this._toastrService.error("Save unsuccessful", "", this.config);

    //         })
    //     } else {
    //         this._researchProfileMultiFormService.updateDataByTabName(this.id, this.researchExprienceFormModelList, this.researchObjectiveFiles, 'ResearchExpriance').subscribe(data => {

    //             if (data.success) {
    //                 this._toastrService.success(data.message, "", this.config);
    //             } else {
    //                 console.log('Successfully not saved')
    //                 this._toastrService.error("Save unsuccessful", "", this.config);
    //             }
    //         }, _ => {
    //             console.log('Successfully not saved')
    //             this._toastrService.error("Save unsuccessful", "", this.config);
    //         })
    //     }
    // }

    checkRequirdField(): Boolean {
        let isValied = true;
        this.researchExprienceFormModelList.forEach(f => {
            if (!f.researchTopic
                || !f.researchYear
                || f.researchStatus === ''
                || f.researchValueInBDT === 0
                || !f.fundingOrganization
            ) {
                isValied = false;
            }
        });
        return isValied;
    }


    save(isApplicable = 0) {

        if (!this.id) {
            const pathSegments = this._location.path().split('/');
            // this.uuid = pathSegments[2];
            this.id = +pathSegments[4];
        }

        if (!this.id) {
            this._toastrService.error('Personal information save first');
            return;
        }

        if(isApplicable == 1){
            return this.saveOrUpdateNotApplication(0);
        }

        if (!this.checkRequirdField()) {
            this._toastrService.warning("Please enter the required information !.", "", this.config);
            return;
        }
        if (localStorage.getItem("profilePersonalInfoId") != null) {
            this.id = +(localStorage.getItem("profilePersonalInfoId"));
            this.isUpdatedAction = true;
        }

        /*if (!this.id) {
            this._toastrService.error('Personal information save first');
            return;
        }*/

        this._researchProfileMultiFormService.saveResearcherExperience(this.researchExprienceFormModelList, this.id).subscribe(res => {
            if (res.success) {
                this._toastrService.success('Saved successfully!', "", this.config);
                this.researchExprienceFormModelList = res.items;
            }
        }, error => {
            this._toastrService.error("Save Unsuccessful", "", this.config);
            console.log(error)
        })
    }

    saveAndNext(isApplicable) {

        if (!this.id) {
            const pathSegments = this._location.path().split('/');
            // this.uuid = pathSegments[2];
            this.id = +pathSegments[4];
        }

        if (!this.id) {
            this._toastrService.error('Personal information save first');
            return;
        }

        if(isApplicable == 1){
            return this.saveOrUpdateNotApplication(1);
        }

        if (!this.checkRequirdField()) {
            this._toastrService.warning("Please enter the required information !.", "", this.config);
            return;
        }
        this.save();
        this.nextTab();
    }

    saveOrUpdateNotApplication(next){
        let uId = +(this._activatedRoute.snapshot.paramMap.get('uid'));

        this._researchProfileMultiFormService.saveOrUpdateNotApplicable(uId).subscribe(res => {
            if (res.success) {
                this.rmsProfileNotApplicable = res.obj;
                sessionStorage.setItem('pId', res?.obj.id);
                this._toastrService.success('Saved successfully!', "", this.config);
                if(next == 1){
                    this.nextTab();
                }
            }
        }, error => {
            this._toastrService.error("Save unsuccessful", "", this.config);
            console.log(error)
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


    addNewForm() {
        this.researchExprienceFormModelList.push(
            {
                id: null,
                profilePersonalInfoId: null,
                researchType: '',
                researchTopic: '',
                fundingOrganization: '',
                researchYear: '',
                supervisorDetail: '',
                isForeign: false,
                researchStatus: '',
                researchValueInBDT: null,
                researchFindingAndImportance: '',
                totalResearchExp: 0,
                isEditable: false,
                isDeleted: false,
                fileUploadModel: new FileUploadModel(),
                createdOn: null,
                updatedBy: "",
                updatedOn: null,
            }
        )
    }

    deleteFormByIndex(index: number) {
        if (this.researchExprienceFormModelList[index].id > 0) {
            // this.researchExprienceFormModelList[index].isDeleted = true;
            this.openDialog(index);
        } else {
            this.researchExprienceFormModelList.splice(index, 1);
        }
    }


    uploadFile(files: FileList, tag: string, index) {
        this._fileUploadService.getFileSize(files).subscribe(res => {
                if(res > 3)
                {
                    this._toastrService.error("File size must be equal or less than 3 MB", "", this.config);
                }
                else
                {
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
            }
        )

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
        this.researchExprienceFormModelList[index].fileUploadModel = fileUploadModel;
    }

    ImageSpliter(file: string) {
        return this.fileUtils.imageNameSpliter(file + '', '-', 0);
    }

    radioChange(val) {

        sessionStorage.setItem('researchExp', val);
        var retrievedObject = sessionStorage.getItem('researchExp');
        console.log('retrievedObject: ', JSON.parse(retrievedObject));

        let rasult = this.researchExprienceFormModelList.some(s => s.id != null && !s.isDeleted);
        if (rasult) {
            this._toastrService.error("First delete the research expriance.");
            setTimeout(() => { this.isApplicable = 2; }, 100 / 99);
            return;
        }
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
                this.researchExprienceFormModelList[i].isDeleted = true;
                this.save();
            }
            dialogRef.close(true);
        });
    }


}
