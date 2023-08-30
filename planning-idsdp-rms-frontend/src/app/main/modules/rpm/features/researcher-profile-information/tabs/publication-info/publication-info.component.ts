import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FuseTranslationLoaderService } from "../../../../../../core/services/translation-loader.service";
import { locale as lngEnglish } from "../../i18n/en";
import { locale as lngBangla } from "../../i18n/bn";
import { EducationInfoFormModel } from "../../../../models/EducationInfoFormModel";
import { PublicationInfoFormModel } from "../../../../models/PublicationInfoFormModel";
import { ResearchProfileMultiFormService } from "../../../../services/research-profile-multi-form.service";
import { ToastrService } from "ngx-toastr";
import { ActivatedRoute } from "@angular/router";
import { addNewIcon, nextIcon, previousIcon, refreshIcon, saveIcon } from 'app/main/modules/rpm/constants/button.constants';
import { DateAdapter } from '@angular/material/core';
import { CommonTypeService } from 'app/main/modules/settings/services/common-type.service';
import { FORM_TYPES_NO } from 'app/main/modules/settings/enum-list.enum';
import { FileUploadModel } from "../../../../../training-institute/models/e-nothi.model";
import { FileUploadService } from "../../../../../../shared/services/file-upload.service";
import { UtilsService } from "../../../../../training-institute/services/utils.service";
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmDialogConstant } from 'app/main/shared/constant/confirm.dialog.constant';
import { SubmitConfirmationDialogComponent } from 'app/main/shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component';
import { RmsProfileNotApplicable } from 'app/main/modules/rpm/models/notApplicable/RmsProfileNotApplicable';
import { DataComService } from 'app/main/core/services/data-com/data-com.service';
import { StorageService } from 'app/main/core/services/storage/storage.service';
import {Location} from "@angular/common";

@Component({
    selector: 'app-publication-info',
    templateUrl: './publication-info.component.html',
    styleUrls: ['./publication-info.component.scss']
})
export class PublicationInfoComponent implements OnInit {

    @Output() nextStep = new EventEmitter<boolean>();
    @Output() backPrevious = new EventEmitter<boolean>();

    publicationInfoFormModelList: PublicationInfoFormModel[] = new Array();

    journalPaperNatureTypeList: any[] = new Array();

    config: { timeOut: 5000; closeButton: true; positionClass: 'toast-top-right'; enableHtml: true; };

    relevantDocs: File[] = new Array();
    id: number;
    isUpdatedAction: boolean;
    isVerifiedNid: boolean = false;
    isVerifiedTin: boolean = false;

    /*----Button---*/
    refreshIcon = refreshIcon;
    saveIcon = saveIcon;
    previousIcon = previousIcon;
    nextIcon = nextIcon;
    addNewIcon = addNewIcon;
    /*----/Button---*/


    rmsProfileNotApplicable = new RmsProfileNotApplicable()
    //publicationInfo = sessionStorage.getItem('publicationInfo');

    spinner2: boolean = true;
    subscribe$: any;
    imageName: null;
    holdImageData: any;
    imgSpinner: boolean = false;
    maxDate:any;

    publicationInfosVal = 0;
    isApplicable: number = 2;

    @Input() set pNotApplicable(value: any) {
        if(value !== undefined && value !== NaN && value != 0  && value <= 2){
            this.isApplicable = (this.publicationInfosVal>0) ? 2 : value;
            this.doSomething(this.isApplicable);
        }
    }

    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private dateAdapter: DateAdapter<Date>,
        private _toastrService: ToastrService,
        private _activatedRoute: ActivatedRoute,
        private _researchProfileMultiFormService: ResearchProfileMultiFormService,
        private commonTypeService: CommonTypeService,
        private _fileUploadService: FileUploadService,
        private fileUtils: UtilsService,
        private matDialog: MatDialog,
        private dataCom: DataComService,
        private storageService: StorageService,
        private _location: Location
        ) {
        // Language translations
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
        this.dateAdapter.setLocale('en-GB');//dd/MM/yyyy

        //Set Default
        this.addNewForm();
    }

    ngOnInit(): void {

        let todayDate = new Date().toISOString().slice(0, 10);
        let ymd = todayDate.split("-");
        let month = (Number(ymd[1]) == 0) ? Number(ymd[1]) : (Number(ymd[1]));
        this.maxDate = new Date(ymd[0]+'-'+month+'-'+ymd[2]);

        const uuid = this._activatedRoute.snapshot.paramMap.get('id');
        this.id = +(this._activatedRoute.snapshot.paramMap.get('uid'));
        if (uuid != null) {
            this.isUpdatedAction = true;
            this.getDataByUuid(uuid)
        } else {
            this.isUpdatedAction = false;
        }
        this.getJournalPaperNatureType();
    }

    doSomething(val){
        //console.log('val ==', val);
    }

    ImageSpliter(file: string) {
        return this.fileUtils.imageNameSpliter(file + '', '-', 0);
    }

    getDataByUuid(uuid: string) {
        this._researchProfileMultiFormService.profileView(uuid).subscribe(data => {
            this.publicationInfoFormModelList = (data.publicationInfos && data.publicationInfos.length > 0) ? data.publicationInfos : [];
            if (!this.publicationInfoFormModelList || this.publicationInfoFormModelList.length < 1) {
                this.addNewForm();
            }
            this.publicationInfoFormModelList = this.publicationInfoFormModelList.map(m => {
                m.journalPaperNature = Number(m.journalPaperNature);
                return m;
            });
            this.publicationInfosVal = data.publicationInfos.length;
            this.isApplicable = (this.publicationInfoFormModelList.length > 0) ? 2 : 1;

        }, error => {
            console.log('Successfully not saved');
        })
    }

    checkRequirdField(): Boolean {
        let isValied = true;
        this.publicationInfoFormModelList.forEach(f => {
            if (!f.publishedIn
                || !f.articleTitle
                || !f.roleInTeam
                || !f.journalPaperNature
                || !f.publicationDate
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
            let info = this.storageService.getUserData();
            //console.log('info = ', info);

            if(info.userType == "Rms_Researcher" && info.isInstitutional == true){
                this._toastrService.error('Institute information save first');
                return
            }
            else
            {
                this._toastrService.error('Personal information save first');
                return;
            }
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

        if (!this.isUpdatedAction) {
            this._researchProfileMultiFormService.saveOrUpdatePulicaion(this.publicationInfoFormModelList, this.id).subscribe(res => {
                if (res.success) {
                    this._toastrService.success('Saved successfully!', "", this.config);
                    this.publicationInfoFormModelList = res.items;
                }
            }, error => {
                this._toastrService.error("Save unsuccessful!", "", this.config);
                console.log(error)
            })
        } else {
            this._researchProfileMultiFormService.saveOrUpdatePulicaion(this.publicationInfoFormModelList, this.id).subscribe(res => {
                if (res.success) {
                    this._toastrService.success('Saved successfully!', "", this.config);
                    this.publicationInfoFormModelList = res.items;
                    console.log('>>', this.publicationInfoFormModelList)
                }
            }, error => {
                this._toastrService.error("Save unsuccessful", "", this.config);
                console.log(error)
            })
        }
    }

    saveAndNext(isApplicable = 0) {

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

        if(isApplicable == 2){
            if (!this.checkRequirdField()) {
                this._toastrService.warning("Please enter the required information !.", "", this.config);
                return;
            }
            this.save();
            this.nextTab();
        }
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

    saveOrUpdateNotApplicationX(next){
        var pId = sessionStorage.getItem('pId');
        var publicationInfo = sessionStorage.getItem('publicationInfo');
        var proExperience = sessionStorage.getItem('proExperience');
        var researchExp = sessionStorage.getItem('researchExp');
        var trainingInfo = sessionStorage.getItem('trainingInfo');

        console.log('typeof  typeof== ',typeof publicationInfo);

        let rmsProfileNotApplicable = {
            id:0,
            m1ResearcherProfilePersonalInfoId:0,
            publicationInfo:0,
            // proExperience:0,
            // researchExp:0,
            // trainingInfo:0,
            formName:"",
            modelName:""
         }

        rmsProfileNotApplicable.id = (typeof pId === 'string') ? +pId : 0;
        let uId = +(this._activatedRoute.snapshot.paramMap.get('uid'));
        rmsProfileNotApplicable.m1ResearcherProfilePersonalInfoId = uId;
        rmsProfileNotApplicable.publicationInfo = (typeof publicationInfo === 'string') ? +publicationInfo : 2;
        // rmsProfileNotApplicable.proExperience = (typeof proExperience === 'string') ? +proExperience : 2;
        // rmsProfileNotApplicable.researchExp = (typeof researchExp === 'string') ? +researchExp : 2;
        // rmsProfileNotApplicable.trainingInfo = (typeof trainingInfo === 'string') ? +trainingInfo : 2;

        rmsProfileNotApplicable.modelName = 'researcher_profile';
        rmsProfileNotApplicable.formName = 'publicationInfo';
        this._researchProfileMultiFormService.saveOrUpdateNotApplicable(rmsProfileNotApplicable).subscribe(res => {
            console.log("res = ", res);

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
        this.publicationInfoFormModelList.push(
            {
                id: null,
                profilePersonalInfoId: null,
                publishedIn: '',
                articleTitle: '',
                roleInTeam: '',
                journalPaperNature: null,
                publicationDate: '',
                issn: '',
                isbn: '',
                uploadRelevantDoc: '',
                isEditable: false,
                fileUploadModel: new FileUploadModel(),
                isDeleted: false,
                createdOn: null,
                updatedBy: null,
                updatedOn: null,
                orchid:null
            }
        );

    }

    // uploadFile(files: FileList, tag: string, index) {
    //     this.imageName = null;
    //     this.imgSpinner = true;
    //     if (tag === 'certificate_image') {
    //         this.UploadToMinio(files, res => {
    //             if (res) {
    //                 this.setFileDetails(index, this.holdImageData);
    //                 this.imgSpinner = false;
    //                 // console.log('j',this.holdImageData)
    //             }
    //         })
    //     }

    // }

    uploadFile(files: FileList, tag: string, index) {

        let fileExtension = ["image/jpeg", "image/png", "application/pdf"];
        this._fileUploadService.fileExtension(files,fileExtension).subscribe(res => {
            console.log('res==', res)
            if(!res.status){
                this._toastrService.error(res.message, "", this.config);
                return;
            }
            else
            {
                this._fileUploadService.getFileSize(files).subscribe(res => {
                    if(res > 1)
                    {
                        this._toastrService.error("File size must be equal or less than 1 MB", "", this.config);
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
                })
            }
        })
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
        this.publicationInfoFormModelList[index].fileUploadModel = fileUploadModel;
    }

    handleFileInput(file: FileList, index: number) {
        this.relevantDocs.push(file.item(0));
    }

    deleteFormByIndex(index: number) {
        let educationInfoFormModels = this.publicationInfoFormModelList.filter(f => f.isDeleted === false);
        // if (educationInfoFormModels.length === 1) {
        //     this._toastrService.info("At least One field Needed ");
        // } else {
            if (!this.publicationInfoFormModelList[index].id) {
                this.publicationInfoFormModelList.splice(index, 1)
            } else {
                this.openDialog(index);
            }
        //}
    }


    //
    // deleteFormByIndex(index: number) {
    //     this.publicationInfoFormModelList.splice(index, 1)
    // }

    radioChange(val) {
        sessionStorage.setItem('publicationInfo', val);
        let rasult = this.publicationInfoFormModelList.some(s => s.id != null);
        if (rasult) {
            this._toastrService.error("First delete the publication information");
            setTimeout(() => { this.isApplicable = 2; }, 100 / 99);
            return;
        }
    }


    private getJournalPaperNatureType() {
        this.spinner2 = true;

        this.commonTypeService.findAllByActiveData(FORM_TYPES_NO.JOURNAL_PAPER_NATURE).subscribe(res => {
            if (res) {
                this.journalPaperNatureTypeList = res;
            }
            this.spinner2 = false;
        });

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
                this.publicationInfoFormModelList[i].isDeleted = true;
                this.save();
            }
            dialogRef.close(true);
        });
    }
}
