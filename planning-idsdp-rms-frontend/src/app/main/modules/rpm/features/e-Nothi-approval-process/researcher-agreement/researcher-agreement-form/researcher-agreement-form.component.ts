import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { MIN_EDITOR_CONFIG } from 'app/main/core/constants/editor-config';
import { ApiService } from 'app/main/core/services/api/api.service';
import { DataComService } from 'app/main/core/services/data-com/data-com.service';
import { GlobalValidationServiceService } from 'app/main/core/services/global-validation-service.service';
//----Lng Translation----
import { FuseTranslationLoaderService } from 'app/main/core/services/translation-loader.service';
import { ResearcherListService } from 'app/main/modules/rpm/services/researcher-list.service';
import { FiscalYearServiceService } from 'app/main/modules/settings/services/fiscal-year-service.service';
import { ResearchCategoryTypeService } from 'app/main/modules/settings/services/research-category-type.service';
import { environment } from 'environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import {
    previousIcon,
    refreshIcon,
    saveIcon,
} from '../../../../constants/button.constants';
import { locale as lngBangla } from '../i18n/bn';
import { locale as lngEnglish } from '../i18n/en';

@Component({
    selector: 'app-researcher-agreement-form',
    templateUrl: './researcher-agreement-form.component.html',
})
export class ResearcherAgreementFormComponent implements OnInit {
    /*----Button---*/
    refreshIcon = refreshIcon;
    saveIcon = saveIcon;
    previousIcon = previousIcon;
    /*----/Button---*/

    @ViewChild('inputForm') inputForm: NgForm;
    subscription: Subscription;

    researcherList : any = [];

    formTypes: any = [];
    spinner: boolean = false;
    frmGroup: FormGroup;
    config: {
        timeOut: 5000;
        closeButton: true;
        positionClass: 'toast-top-right';
        enableHtml: true;
    };
    formTitle = ''; //Edit

    baseUrl = environment.ibcs.rpmBackend + 'api/eNothi-approval/';
    fiscalYearList: any = [];
    researchCategoryTypeList: any[] = [];
    researchProposalList: any[] = [];

    sendData: { stFiscalYearId: number, stResearchCategoryTypeId: number } = { stFiscalYearId: null, stResearchCategoryTypeId: null }

    @ViewChild('ckeditorf') ckeditorf: any;
    minEditorConfig: any = MIN_EDITOR_CONFIG;
    fileToUpload1: any;
    profileImageName: any;
    profileImageNamePreviewUrl: any;
    fileToUpload = '';

    fileName: any = '';
    documentFiles: [];
    mediumEditorConfig: any = MIN_EDITOR_CONFIG;
    constructor(
        private formBuilder: FormBuilder,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private api: ApiService,
        private toastr: ToastrService,
        private globalVal: GlobalValidationServiceService,
        private dataCom: DataComService,
        private router: Router,
        private fiscalYearService: FiscalYearServiceService,
        private researchCategoryTypeService: ResearchCategoryTypeService,
        private _researcherListService : ResearcherListService
    ) {
        // Language translations
        this._fuseTranslationLoaderService.loadTranslations(
            lngEnglish,
            lngBangla
        );

        this.frmGroup = this.formBuilder.group({
            uuid: [''],
            stFiscalYearId: [],
            dataFor:['researcher-agreement'],
            stResearchCategoryTypeId:['',[this.globalVal.trimValidator('Research Category')]],
            m1ResearcherProposalUuid:['',[this.globalVal.trimValidator('Research Proposal')]],
            subject: ['', [this.globalVal.trimValidator('Subject')]],
            internalApproval: [false],
            note: ['', [this.globalVal.trimValidator('Note')]],
        });
    }

    ngOnInit(): void {

        this.fiscalYearService.getAllActive().subscribe((res) => {
            this.fiscalYearList = res.items ? res.items : [];
        });

        this.researchCategoryTypeService.getAllActiveList().subscribe(
            response => {
                this.researchCategoryTypeList = response.items ? response.items : [];
            }

        );

        this.subscription = this.dataCom.getPassedItemData.subscribe(
            (res) => {
                if (res && res.uuid != '') {

                    this.sendData.stFiscalYearId = res.stFiscalYearId;
                    this.sendData.stResearchCategoryTypeId = res.stResearchCategoryTypeId;
                    this.fileName = res.fileName;
                    this.formTitle = 'Edit';
                    this.frmGroup.patchValue(res);

                    this. getResearchList();
                }
            },
            (err) => {
                this.formTitle = 'Add';
            }
        );
    }

    onChangeFiscalYear(stFiscalYearId: any) {
        if(stFiscalYearId.value > 0){
            this.sendData.stFiscalYearId = stFiscalYearId.value;
            this.getResearchList();
        }
    }

    onChangeResearchCategory(categoryId: any) {
        if(categoryId.value > 0){
            this.sendData.stResearchCategoryTypeId = categoryId.value;
            this.getResearchList();
        }
    }

    getResearchList() {

        let data = this.sendData;
        if(data.stFiscalYearId > 0 && data.stResearchCategoryTypeId > 0)
        {
            this._researcherListService.findResearchProposalListByFiscalYearAndResearchCatId(data.stFiscalYearId, data.stResearchCategoryTypeId).subscribe(
                response => {
                    this.spinner = false;
                    this.researchProposalList = response.items ? response.items : [];
                },
                error => {
                    this.spinner = false;
                }
            );
        }

    }

    getEditableData() {
        this.subscription = this.dataCom.getPassedItemData.subscribe(
            (res) => {
                if (res && res.uuid != '') {
                    this.formTitle = 'Edit';
                    this.frmGroup.patchValue(res);
                }
            },
            (err) => {
                this.formTitle = 'Add';
            }
        );
    }

    editRow(data) {
        this.formTitle = 'Edit';
        this.frmGroup.patchValue(data);
        this.frmGroup.patchValue({ active: data.active.toString() });
    }

    /*------------------------Insert form functions----------------------*/
    onSubmit() {
        if (this.frmGroup.valid) {
            this.submitForm();
        }
    }

    submitForm() {
        this.spinner = true;
        this.frmGroup.patchValue({ dataFor: 'researcher-agreement'});
        if ( this.frmGroup.value.uuid != '' && this.frmGroup.value.uuid != null)
        {
            var formData = new FormData();
            console.log('this.fileToUpload == ', this.fileToUpload);
            formData.append('file', this.fileToUpload);
            formData.append('body', JSON.stringify(this.frmGroup.value));

            this.api.update(this.baseUrl + 'edit', formData).subscribe(
                (res) => {
                    if (res.success > 0) {
                        this.spinner = false;
                        this.toastr.success(res.message, '', this.config);
                        this.formReset();
                        this.back();
                    } else {
                        this.spinner = false;
                        this.toastr.warning(res.message, '', this.config);
                    }
                },
                (err) => {
                    this.toastr.error('Http Error Occord !', '', this.config);
                }
            );
        } else {
            const formData = new FormData();
            formData.append('file', this.fileToUpload);
            formData.append('body', JSON.stringify(this.frmGroup.value));

            this.api.post(this.baseUrl + 'add', formData).subscribe(
                (res) => {
                    if (res.success > 0) {
                        this.spinner = false;
                        this.toastr.success(res.message, '', this.config);
                        this.formReset();
                        this.back();
                    } else {
                        this.spinner = false;
                        this.toastr.warning(res.message, '', this.config);
                    }
                },
                (err) => {
                    this.toastr.error('Http Error Occord !', '', this.config);
                }
            );
        }
    }

    formReset() {
        this.formTitle = 'Add';
        this.frmGroup.reset();
        this.inputForm.resetForm();
        this.frmGroup.patchValue({ active: 'true' });
    }
    back() {
        this.router.navigate(['e-Nothi/researcher-agreement-list']);
    }
    /*------------------------/Insert form functions----------------------*/

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    handleFilesUpload(
        files: any,
        index: number,
        maxIheight: number,
        maxIwidth: number,
        fileSizeInKB
    ) {
        this.fileToUpload1 = files.item(0);
        let fileName = files.item(0).name;
        console.log('this.fileToUpload1', this.fileToUpload1);

        let fileExtension = fileName.replace(/^.*\./, '');
        //console.log("fileExtension", fileExtension);
        let allowedExtensions =
            /(\.jpg|\.JPG|\.jpeg|\.JPEG|\.png|\.PNG|\.pdf|\.PDF|\.doc|\.docx)$/i;
        if (!allowedExtensions.exec(fileName)) {
            let message =
                'You can upload jpg, jpeg, png, pdf and docx file only';
            console.log('message', message);
        } else {
            this.fileToUpload = files.item(0);
            console.log('fileToUpload', this.fileToUpload);
        }
    }
}
