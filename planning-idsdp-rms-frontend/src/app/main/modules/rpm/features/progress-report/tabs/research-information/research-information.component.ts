import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';

import {
    addNewIcon,
    nextIcon,
    previousIcon,
    refreshIcon,
    saveIcon,
    editIcon,
} from 'app/main/modules/rpm/constants/button.constants';
import {locale as lngEnglish} from "../../../progress-report/i18n/en";
import {locale as lngBangla} from "../../../progress-report/i18n/bn";
import {FuseTranslationLoaderService} from "../../../../../../core/services/translation-loader.service";
import {FormBuilder} from "@angular/forms";
import {SubmitProgressReportServiceService} from "../../../../services/submit-progress-report-service.service";
import {GlobalValidationServiceService} from "../../../../../../core/services/global-validation-service.service";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";
import {ResearchCancellationServiceService} from "../../../../services/research-cancellation-service.service";
import {StorageService} from "app/main/core/services/storage/storage.service";

@Component({
    selector: 'app-research-information',
    templateUrl: './research-information.component.html',
    styleUrls: ['./research-information.component.scss']
})
export class ResearchInformationComponent implements OnInit {
    @Output() nextStep = new EventEmitter<boolean>();
    @Output() backPrevious = new EventEmitter<boolean>();

    fileToUpload: { id: number, file: File }[] = [];
    @ViewChild('myForm') myForm: FormBuilder;

    config: { timeOut: 5000; closeButton: true; positionClass: 'toast-top-right'; enableHtml: true; };

    /*----Button---*/
    refreshIcon = refreshIcon;
    saveIcon = saveIcon;
    previousIcon = previousIcon;
    addNewIcon = addNewIcon;
    nextIcon = nextIcon;
    editIcon = editIcon;
    /*----/Button---*/

    attachment: string = null;
    frmGroup: any;
    change: string = 'false';
    formTitle = 'Save'; //Edit
    ResearchInfo: any;
    ResearchInfoData: any;
    fileUrl: any;
    spinner: boolean = false;

    fiscalYear: any;
    category: any;
    percentage: any;
    isData: any;
    submitData: any;
    element: any;
    loginUserInfo: any;


    constructor(
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private formBuilder: FormBuilder,
        private globalVal: GlobalValidationServiceService,
        private _submitProgressRepost: SubmitProgressReportServiceService,
        private toastr: ToastrService,
        private router: Router,
        private StorageService: StorageService,
        private researchAction:ResearchCancellationServiceService,
    ) {
        // Language translations
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

    ngOnInit(): void {
        this.loginUserInfo = this.StorageService.getUserData();
        this.getActiveResearchInfo();
        this.isData = false;
        this.element = this._submitProgressRepost.data
        this.frmGroup = this.formBuilder.group({
            uuid: [''],
            id: [''],
            researchTitle: ['', [this.globalVal.trimValidator('Research Title')]],
            researchCompletePercentage: [''],
            fiscalYear: [''],
            researchCategory: [''],
            fileDownloadUrl: [''],
            bucketName: [''],
            fileName: [''],
            mode: [''],
        });
        this.change = 'false';

        if(this._submitProgressRepost.mode == 'Edit'){
            this.isData = true;
            this.formTitle = 'Edit';
            this.frmGroup.controls["researchTitle"].setValue(this.element.researcherProposalInfoId);
            this.frmGroup.controls["fiscalYear"].setValue(this.element.fiscalResponseDto.fiscalYear);
            this.frmGroup.controls["researchCompletePercentage"].setValue(this.element.researchCompletedPercentage);
            this.frmGroup.controls["researchCategory"].setValue(this.element.researchCategoryTypeResponseDto.categoryName);
            this.attachment= this.element.fileName;
            this.fileUrl=this.element.downloadUrl;
        }
    }

    getActiveResearchInfo() {
        this.spinner = true;
        if(this.loginUserInfo.userType !== 'Rms_DO'){
            this.researchAction.getResearchTitleList(this.loginUserInfo.id).subscribe(
                res => {
                    this.ResearchInfo = res.obj ? res.obj: [];
                    this.spinner = false;
                },
                err => {
                    this.toastr.error('Http Error Occurred !.', "", this.config);
                })
        }else{
            this.researchAction.getResearchTitleList(this.loginUserInfo.id).subscribe(res => {
                    this.ResearchInfo = res.obj ? res.obj: [];
                    this.spinner = false;
                },
                err => {
                    this.toastr.error('Http Error Occurred !.', "", this.config);
            })}
    }

    compareFn(x: any, y: any): boolean {
        return x && y ? x.resProfilePersonalInfoId === y : x.resProfilePersonalInfoId === y;
    }

    selectResearchTitleUuid(event) {
        this.spinner = true;
        this._submitProgressRepost.getResearchInfoDataByUuid(event.uuid).subscribe(res => {
            this.ResearchInfoData = res.obj;
            this.spinner = false;
            this.frmGroup.controls["fiscalYear"].setValue(this.ResearchInfoData.fiscalYear.fiscalYear);
            this.frmGroup.controls["researchCategory"].setValue(this.ResearchInfoData.researchCategoryType.categoryName);
        })
        this.isData = true;
    }

    onSubmit() {
        this.submitForm();
    }

    submitForm() {
        if (this.formTitle == 'Edit' && this.change == 'true') {
            this.submitData = {
                "id":this.element.id,
                "uuid":this.element.uuid,
                "researcherProposalInfoId": this.ResearchInfoData ? this.ResearchInfoData.resProfilePersonalInfoId : this.element.researcherProposalInfoId,
                "fiscalYearId": this.ResearchInfoData ? this.ResearchInfoData.stFiscalYearId : this.element.fiscalYearId,
                "researchCatTypeId": this.ResearchInfoData ? this.ResearchInfoData.stResearchCatTypeId : this.element.researchCatTypeId,
                "researchCompletedPercentage": this.frmGroup.value.researchCompletePercentage,
                "details": '',
                "isSend": false,
                "isEditable": false,
                "bucketName": '',
                "fileName": '',
                "downloadUrl": '',
                "mode": 'edit'
            };

            this._submitProgressRepost.saveData(this.fileToUpload, this.submitData).subscribe(
                res => {
                    if (res.success) {
                        this.toastr.success(res.message, "", this.config);
                        this.fileToUpload = [];
                        this._submitProgressRepost.id = res.obj.id;
                        this.reset();
                    } else {
                        this.toastr.error(res.message, "", this.config);
                    }
                },
                err => {
                    this.toastr.error('Http Error Occord !.', "", this.config);
                }
            )
        }
        if (this.formTitle == 'Edit' && this.change == 'false') {
            this.submitData = {
                "id":this.element.id,
                "uuid":this.element.uuid,
                "researcherProposalInfoId": this.ResearchInfoData ? this.ResearchInfoData.resProfilePersonalInfoId : this.element.researcherProposalInfoId,
                "fiscalYearId": this.ResearchInfoData ? this.ResearchInfoData.stFiscalYearId : this.element.fiscalYearId,
                "researchCatTypeId": this.ResearchInfoData ? this.ResearchInfoData.stResearchCatTypeId : this.element.researchCatTypeId,
                "researchCompletedPercentage": this.frmGroup.value.researchCompletePercentage,
                "details": this.element.details,
                "isSend": this.element.isSend,
                "isEditable": this.element.isEditable,
                "bucketName": this.element.bucketName,
                "fileName": this.element.fileName,
                "downloadUrl": this.element.downloadUrl,
                "mode": this.element.mode
            };
            this._submitProgressRepost.updateData(this.submitData).subscribe(
                res => {
                    if (res.success) {
                        this.toastr.success(res.message, "", this.config);
                        this._submitProgressRepost.id = res.obj.id;
                    } else {
                        this.toastr.error(res.message, "", this.config);
                    }
                },
                err => {
                    this.toastr.error('Http Error Occord !.', "", this.config);
                }
            )
        }
        if (this.formTitle != 'Edit') {
            this.submitData = {
                "researcherProposalInfoId": this.ResearchInfoData.resProfilePersonalInfoId,
                "fiscalYearId": this.ResearchInfoData.stFiscalYearId,
                "researchCatTypeId": this.ResearchInfoData.stResearchCatTypeId,
                "researchCompletedPercentage": this.frmGroup.value.researchCompletePercentage,
                "details": '',
                "isSend": false,
                "isEditable": false,
                "bucketName": '',
                "fileName": '',
                "downloadUrl": '',
                "mode": ''
            };
            this._submitProgressRepost.saveData(this.fileToUpload, this.submitData).subscribe(
                res => {
                    if (res.success) {
                        this.toastr.success(res.message, "", this.config);
                        this.fileToUpload = [];
                        this._submitProgressRepost.id = res.obj.id;
                        this.reset();

                    } else {
                        this.toastr.error(res.message, "", this.config);
                    }
                },
                err => {
                    this.toastr.error('Http Error Occord !.', "", this.config);
                }
            )
        }
    }

    reset() {
        this.frmGroup.reset();
        this.formTitle == 'Save'
        this.fiscalYear = ''
        this.category = ''
        this.isData = false;
    }


    handleFileInput(files: FileList, index: number) {
        if (index === 0) {
            this.attachment = ''
        }
        this.fileToUpload = [];
        this.attachment = ''
        this.change = 'true';
        this.fileToUpload.push({id: index, file: files.item(0)});
    }

    public prevent(event){
        if(event.key == '-' || event.key == '+' || event.key == 'e' || event.key == 'E'){
            event.preventDefault();
        }
    }


    saveAndNext() {
        this.nextTab();
        this.onSubmit();
    }
    backTab(){
        this.router.navigate(['list-progress-report']);
    }

    nextTab() {
        this.nextStep.emit(true);
    }

    previousTab(): void {
        this.backPrevious.emit(true);
    }

}
