import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
//----Lng Translation----
import { FuseTranslationLoaderService } from 'app/main/core/services/translation-loader.service';
import { locale as lngEnglish } from '../i18n/en';
import { locale as lngBangla } from '../i18n/bn';
import { ApiService } from 'app/main/core/services/api/api.service';
import { ToastrService } from 'ngx-toastr';
import { GlobalValidationServiceService } from 'app/main/core/services/global-validation-service.service';
import { FiscalYearWiseSectorSubSector } from '../../../models/FiscalYearWiseSectorSubSector';
import { DEFAULT_SIZE } from 'app/main/core/constants/constant';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SnackbarHelper } from 'app/main/core/helper/snackbar.helper';
import { environment } from 'environments/environment';
import { DataComService } from 'app/main/core/services/data-com/data-com.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { previousIcon, refreshIcon, saveIcon } from '../../../constants/button.constants';
import { CreateLetterGedServiceService } from '../../../services/create-letter-ged-service.service';
import { ResearchCancellationResearcher } from '../../../enums/enum-list.enum';
import { ResearchCancellationDeskOfficer } from '../../../enums/enum-list.enum';
import { ResearchCancellationStatus } from "../../../enums/enum-list.enum";
import { ResearchCancellationServiceService } from "../../../services/research-cancellation-service.service";
import { StorageService } from "app/main/core/services/storage/storage.service";
import { CreateGoLetterServiceService } from "../../../services/create-go-letter-service.service";
import { DateAdapter } from '@angular/material/core';
import { data } from 'autoprefixer';
import {MIN_EDITOR_CONFIG} from "../../../../../core/constants/editor-config";

@Component({
    selector: 'app-research-cancellation-add',
    templateUrl: './research-cancellation-add.component.html',
    styleUrls: ['./research-cancellation-add.component.scss']
})
export class ResearchCancellationAddComponent implements OnInit {

    @ViewChild("ckeditor1") public ckeditor1: any;

    /*----Button---*/
    refreshIcon = refreshIcon;
    saveIcon = saveIcon;
    previousIcon = previousIcon;
    /*----/Button---*/

    @ViewChild('inputForm') inputForm: NgForm;
    subscription: Subscription;

    spinner: boolean = false;
    frmGroup: FormGroup;
    config: { timeOut: 5000; closeButton: true; positionClass: 'toast-top-right'; enableHtml: true; };
    formTitle = 'Save'; //Edit
    editData: any = null;
    change: string = 'false';
    loginUserInfo: any;
    showResearchDuration = false;
    showGrantAmt = false;
    researchLists: any;
    researchInfoLists: any;
    templateId: any;
    predifinedTemplateId: any;
    templateType: any;
    predifinedTemplate: any;

    public researchList = ResearchCancellationResearcher;
    public researchDeskOfficer = ResearchCancellationDeskOfficer;
    public researchStatus = ResearchCancellationStatus;

    mediumEditorConfig: any = MIN_EDITOR_CONFIG;
    constructor(
        private dateAdapter: DateAdapter<Date>,
        private formBuilder: FormBuilder,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private api: ApiService,
        private toastr: ToastrService,
        private globalVal: GlobalValidationServiceService,
        private matSnackBar: SnackbarHelper,
        private dialog: MatDialog,
        private dataCom: DataComService,
        private router: Router,
        private researchAction: ResearchCancellationServiceService,
        private createLetterService: CreateLetterGedServiceService,
        private StorageService: StorageService,
        private _createGoLetterServiceService: CreateGoLetterServiceService,
    ) {
        // Language translations
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
        this.dateAdapter.setLocale('en-GB');//dd/MM/yyyy
    }

    ngOnInit(): void {
        this.loginUserInfo = this.StorageService.getUserData();
        this.getActiveTemplateType();
        this.getResearchList();

        this.frmGroup = this.formBuilder.group({
            uuid: [''],
            id: [],
            researcherProposalInfoId: ['', [this.globalVal.trimValidator('Research Title')]],
            formula: ['', [this.globalVal.trimValidator('Formula')]],
            actionFor: ['', [this.globalVal.trimValidator('Action For')]],
            newResearchStartDate: [new Date()],
            newResearchEndDate: [new Date()],
            newResearchDurationMonth: [''],
            newTotalGrantAmount: [''],
            subject: ['', [this.globalVal.trimValidator('Subject')]],
            details: ['', [this.globalVal.trimValidator('Details')]],
            status: ['Pending', [this.globalVal.trimValidator('Status')]],
            exManth: [0, ''],
            exYear: [0, ''],
            templateType : ['',''],
            predefineTemplate :['','']
        });

        this.editData = this.researchAction.data;

        if (this.editData != null) {
            if (this.editData.actionFor == 'Increase Research Duration' || this.editData.actionFor == 'Increase Duration & Grant Amount') {
                this.showResearchDuration = true;
                this.showGrantAmt = false;
            } else if (this.editData.actionFor == 'Increase Grant Amount') {
                this.showGrantAmt = true;
                this.showResearchDuration = false;
            } else {
                this.showResearchDuration = false;
                this.showGrantAmt = false;
            }

            this.formTitle = "Edit";
            this.frmGroup.patchValue(this.editData);
            this.researchAction.getResearchInformationById(this.editData.researcherProposalInfoId).subscribe(
                res => {
                    this.researchInfoLists = res.obj ? res.obj : [];
                    let sdt: any = new Date(this.researchInfoLists.researchStartDate);
                    let endDate: any = new Date(this.researchInfoLists.researchEndDate);
                    let difdt: any = new Date(endDate - sdt);
                    //+ difdt.getDate() + "D"
                    this.frmGroup.patchValue({
                        ['newResearchDurationMonth']: (difdt.toISOString().slice(0, 4) - 1970) + "Year " + (difdt.getMonth()) + "Month"
                    });
                });
        }
    }

    editRow(data) {
        this.formTitle = "Edit";
        this.frmGroup.patchValue(data);
    }

    /*------------------------Insert form functions----------------------*/
    onSubmit() {
        if (this.frmGroup.valid) {
            this.submitForm();
        }
    }

    submitForm() {
        if (this.formTitle != 'Edit') {
            this.researchAction.save(this.frmGroup.value).subscribe(
                res => {
                    if (res.success) {
                        this.toastr.success(res.message, "", this.config);
                        this.router.navigate(['/research-cancellation']);
                    } else {
                        this.toastr.error(res.message, "", this.config);
                    }
                },
                err => {
                    this.toastr.error('Http Error Occurred !.', "", this.config);
                }
            )
        }
        else {
            this.researchAction.update(this.frmGroup.value).subscribe(
                res => {
                    if (res.success) {
                        this.toastr.success(res.message, "", this.config);
                        this.router.navigate(['/research-cancellation']);
                    } else {
                        this.toastr.error(res.message, "", this.config);
                    }
                },
                err => {
                    this.toastr.error('Http Error Occurred !.', "", this.config);
                }
            )
        }
    }

    formReset() {
        this.formTitle = 'Save';
        this.frmGroup.reset();
        this.inputForm.resetForm();
        setTimeout(() => {
            this.ckeditor1.instance.setData('');
        }, 500);
    }

    public getAction(event) {

        if (!this.frmGroup.value.researcherProposalInfoId) {
            this.toastr.error('Please select research title first !.', "", this.config);
            return;
        }

        if (event.value == 'Increase Research Duration' || event.value == 'Increase Duration & Grant Amount') {
            this.showResearchDuration = true;
            this.showGrantAmt = false;


            this.frmGroup.patchValue({
                ['newResearchEndDate']: new Date(this.researchInfoLists.researchEndDate)
            });

            this.frmGroup.patchValue({
                ['exManth']: 0
            });

            this.frmGroup.patchValue({
                ['exYear']: 0
            });

            let sdt: any = new Date(this.researchInfoLists.researchStartDate);
            let endDate: any = new Date(this.researchInfoLists.researchEndDate);
            let difdt: any = new Date(endDate - sdt);

            this.frmGroup.patchValue({
                ['newResearchDurationMonth']: (difdt.toISOString().slice(0, 4) - 1970) + "Year" + (difdt.getMonth()) + "Month "
            });

        } else if (event.value == 'Increase Grant Amount') {
            this.showGrantAmt = true;
            this.showResearchDuration = false;
        } else {
            this.showResearchDuration = false;
            this.showGrantAmt = false;
        }
    }



    back() {
        this.editData = null;
        this.router.navigate(['/research-cancellation']);
    }

    public prevent(event) {
        if (event.key == '-' || event.key == '+' || event.key == 'e' || event.key == 'E') {
            event.preventDefault();
        }
    }

    getResearchList() {
        this.researchAction.getResearchTitleList(this.loginUserInfo.id).subscribe(
            res => {
                this.researchLists = res.obj ? res.obj : [];
            },
            err => {
                this.toastr.error('Http Error Occurred !.', "", this.config);
            })
    }

    getResearchInformationById(event) {
        this.researchAction.getResearchInformationById(event.value).subscribe(
            res => {
                this.researchInfoLists = res.obj ? res.obj : [];
            },
            err => {
                this.toastr.error('Http Error Occurred !.', "", this.config);
            })
    }

    getActiveTemplateType() {
        this._createGoLetterServiceService.getAllActiveTemplateType().subscribe(res => {
            this.templateType = res.items;
        })
    }

    selectTemplateType(event) {
        this.templateId = event.id;
        this.ckeditor1.instance.setData('');
        this._createGoLetterServiceService.getPredefineTemplateTypeBySelectedTemplateType(event.id).subscribe(res => {
            this.predifinedTemplate = res.items;
        })
    }

    selectPredefinedTemplate(event) {
        this.predifinedTemplateId = event.id;

        if (!event.header == null || event.header != '') {
            this.ckeditor1.instance.setData(event.header);
        } else {
            this.ckeditor1.instance.setData('');
        }
    }

    onChnageExManthAndYear() {

        if (!this.frmGroup.value.researcherProposalInfoId) {
            this.toastr.error('Please select research title first !.', "", this.config);
            return;
        }

        let uMonth = Number(this.frmGroup.value.exManth);
        let uYear = Number(this.frmGroup.value.exYear);

        let date = new Date(this.researchInfoLists.researchEndDate);
        let oldMonth = date.getMonth() + 1;
        let oldYear = date.getFullYear();


        let newDay = date.getDate() + 1;
        let newMonth = date.getMonth() + 1;
        let newYear = date.getFullYear();

        if ((oldMonth + uMonth) > 12) {
            newMonth = (oldMonth + uMonth) - 12;
            newYear = (oldYear + 1);
        } else {
            newMonth += uMonth;
        }
        newYear += uYear;
        newDay + '/' + newMonth + '/' + newYear;


        this.frmGroup.patchValue({
            ['newResearchEndDate']: new Date(newYear + '-' + newMonth + '-' + newDay)
        });

        let sdt: any = new Date(this.researchInfoLists.researchStartDate);
        let endDate: any = new Date(this.frmGroup.value.newResearchEndDate);
        let difdt: any = new Date(endDate - sdt);

        this.frmGroup.patchValue({
            ['newResearchDurationMonth']: (difdt.toISOString().slice(0, 4) - 1970) + "Year" + (difdt.getMonth()) + "Month "
        });

    }
}
