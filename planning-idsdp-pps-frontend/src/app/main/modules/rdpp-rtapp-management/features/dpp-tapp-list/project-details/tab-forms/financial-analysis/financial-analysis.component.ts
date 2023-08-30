import {Component, EventEmitter, OnInit, Output, TemplateRef} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal'
/*----Lng Translation----*/
import {locale as lngEnglish} from './i18n/en';
import {locale as lngBangla} from './i18n/bn';
import {FuseTranslationLoaderService} from '../../../../../../../core/services/translation-loader.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {FinancialAnalysis} from '../../models/financial-analysis.model';
import {ProjectDetailsPartB} from '../../models/project-details-partb.model';
import {ProjectDetailsPartbService} from '../../services/project-details-partb.service';
import {FinancialAnalysisService} from '../../services/financial-analysis.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute, Router} from "@angular/router";
import {SnackbarHelper} from "../../../../../../../core/helper/snackbar.helper";
import {ProjectSummaryService} from "../../../../../../project-concept-management/services/project-summary.service";
import {environment} from "../../../../../../../../../environments/environment";
import {DppObjectiveCostService} from "../../../../../services/dpp-objective-cost.service";
import {FileUploadService} from "../../../../../../../core/services/file-upload.service";
import { UtilsService } from 'app/main/core/services/utils.service';
import {RdppFinancialAnalysis} from "../../../../../models/rdpp-financial-analysis.model";

/*----/Lng Translation----*/

@Component({
    selector: 'app-financial-analysis',
    templateUrl: './financial-analysis.component.html',
    styleUrls: ['./financial-analysis.component.scss']
})

export class FinancialAnalysisComponent implements OnInit {
    @Output() backPreviousPage = new EventEmitter<boolean>();
    @Output() nextStep = new EventEmitter<boolean>();
    conceptUuid = this.route.snapshot.params['id'];
    modalRef: BsModalRef;
    editor1 = false;
    content = '';
    uuid: string;
    dppMasterUuid;
    formGroup: FormGroup;
    financialAnalysis: RdppFinancialAnalysis = new RdppFinancialAnalysis();
    projectDetails: ProjectDetailsPartB = new ProjectDetailsPartB();
    projectConceptMasterId: number;
    update1: boolean;
    update2: boolean;
    update3: boolean;
    downloadattachment: boolean;
    buttonDisable: boolean;
    summaryFindingAttachmentId: number;
    economicAttachmentId: number;
    financialAttachmentId: number;
    file: File;
    isUpdate: boolean;

    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
                private modalService: BsModalService,
                private _formBuilder: FormBuilder,
                private route: ActivatedRoute,
                private router: Router,
                private snackbarHelper: SnackbarHelper,
                private fileUploadService: FileUploadService,
                private _projectDetailsPartbService: ProjectDetailsPartbService,
                private projectSummaryService: ProjectSummaryService,
                private objectiveAndCostService: DppObjectiveCostService,
                private _financialAnalysisService: FinancialAnalysisService,
                private utilsService: UtilsService,
                private _snackBar: MatSnackBar) {
        // Set the navigation translations
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla)
    }

    ngOnInit(): void {
        this.loadFormValue();
        this.getDppMasterUuid();
        this._projectDetailsPartbService.getProjectDetailsPartBuuid().subscribe(uuid => {
            let uuId = uuid;
            console.log(uuId);
            this.projectDetails.uuid = uuid;
        });
        this.conceptUuid = this.route.snapshot.params['id'];
        this.getProjectConceptMasterId();
        this.getFinancialAnalysis();
    }

    toggleShow1 = () => this.editor1 = this.editor1 = !this.editor1;

    /*----/For loading FormValue----*/
    loadFormValue() {
        this.formGroup = this._formBuilder.group({
            weatherAppraisalStudy: [''],
            // financialProjectLifeTime: ['', Validators.required],
            // economicProjectLifeTime: ['', Validators.required],
            // financialDiscountFactor: ['', Validators.required],
            // economicDiscountFactor: [null, Validators.required],

            financialNpv: [''],
            economicNpv: [''],
            financialBcr: [''],
            economicBcr: [''],
            fiancialIrr: [''],
            economicIrr: [''],
            attachSummaryFinding: [''],
            financialAttachment: [''],
            economicAttachment: [''],

        });
    }

    /* For getting Master table data */
    getDppMasterUuid() {
        this.objectiveAndCostService.getByProjectConceptUuid(this.conceptUuid).subscribe((response) => {
            let res = response.res;
            this.dppMasterUuid = res.uuid;
            this.buttonEnable();
        })
    }

    buttonEnable() {
        if (this.dppMasterUuid == null) {
            this.buttonDisable = true;
        } else {
            this.buttonDisable = false;
        }
    }

    getProjectConceptMasterId() {
        this.projectSummaryService.getByUuid(this.conceptUuid).subscribe((res) => {
            this.projectConceptMasterId = res.id;
        })
    }

    public openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template, {class: 'modal-lg'});
    }

    public closeModal(template: TemplateRef<any>) {
        this.modalService.hide();
    }


    /* For saving financial analysis */

    onSubmit() {
        if (this.isUpdate) {
            this.update();
        } else {
            this.save();
        }
    }


    /* For saving and Exit financial analysis */

    onSubmitAndExit() {
        if (this.isUpdate) {
            this.updateAndExit();
        } else {
            this.saveAndExit();
        }
    }

    /* For saving financial analysis */

    save() {
        if (this.formGroup.valid) {
            this.saveFinancialAnalysis();
        }
    }


    /* For save and Exit financial analysis */

    saveAndExit() {
        if (this.formGroup.valid) {
            this.saveFinancialAnalysis();
            this.router.navigate(['dpp-tapp/dashboard/' + this.conceptUuid]);
        }
    }



    /* For update financial analysis */

    update() {
        if (this.formGroup.valid) {
            this.updateFinancialAnalysis();
        }
    }

    /* For update and Exit financial analysis */

    updateAndExit() {
        if (this.formGroup.valid) {
            this.updateFinancialAnalysis();
            this.router.navigate(['dpp-tapp/dashboard/' + this.conceptUuid]);
        }
    }

    /* For saving financial analysis */

    saveFinancialAnalysis(): any {
        this.convertFormToDto();
        this._financialAnalysisService.saveFinancialAnalysis(this.financialAnalysis).subscribe(res => {
            this.getFinancialAnalysis();
            this.formGroup.reset();
            this.snackbarHelper.openSuccessSnackBarWithMessage("Successfully Save Data", "Ok");
        })
    }


    /* For Update financial analysis */

    updateFinancialAnalysis(): any {
        this.convertFormToDto();
        this._financialAnalysisService.updateFinancialAnalysis(this.financialAnalysis, this.conceptUuid).subscribe(res => {
            this.formGroup.reset();
            this.getFinancialAnalysis();
            this.snackbarHelper.openSuccessSnackBarWithMessage("Successfully Updated Data", "Ok");
        })
    }

    convertFormToDto(): any {
        this.financialAnalysis.weatherAppraisalStudy = this.formGroup.value.weatherAppraisalStudy;
        this.financialAnalysis.financialProjectLifeTime = this.formGroup.value.financialProjectLifeTime;
        this.financialAnalysis.economicProjectLifeTime = this.formGroup.value.economicProjectLifeTime;
        this.financialAnalysis.financialDiscountFactor = this.formGroup.value.financialDiscountFactor;
        this.financialAnalysis.economicDiscountFactor = this.formGroup.value.economicDiscountFactor;
        this.financialAnalysis.financialNpv = this.formGroup.value.financialNpv;
        this.financialAnalysis.economicNpv = this.formGroup.value.economicNpv;
        this.financialAnalysis.financialBcr = this.formGroup.value.financialBcr;
        this.financialAnalysis.economicBcr = this.formGroup.value.economicBcr;
        this.financialAnalysis.financialIrr = this.formGroup.value.fiancialIrr;
        this.financialAnalysis.economicIrr = this.formGroup.value.economicIrr;
        this.financialAnalysis.projectConceptUuid = this.conceptUuid;
        this.financialAnalysis.projectConceptMasterId = this.projectConceptMasterId;
        // this.financialAnalysis.attachmentSummaryId = this.summaryFindingAttachmentId;
        this.financialAnalysis.economicAnalysisAttachmentId = this.economicAttachmentId;
        this.financialAnalysis.financialAnalysisAttachmentId = this.financialAttachmentId;
    }


    /*
  Get Financial Analysis value
   */

    getFinancialAnalysis() {
        this._financialAnalysisService.getFinancialAnalysis(this.conceptUuid).subscribe((response) => {
            if(response.status == 200) {
                this.isUpdate = true;
                this.uuid = response.res.uuid;
                this.setFinancialAnalysis(response.res);
                if (response.res.summaryFindingAttachmentId != null) {
                    this.summaryFindingAttachmentId = response.res.summaryFindingAttachmentId.id;
                }
                if (response.res.economicAttachmentId != null) {
                    this.economicAttachmentId = response.res.economicAttachmentId.id;
                }
                if (response.res.financialAttachmentId != null) {
                    this.financialAttachmentId = response.res.id;
                }

            } else {
                this.isUpdate = false;
            }

        }, error => {
            console.log(error);
        })
    }


    /*
   Set form value
    */
    setFinancialAnalysis(res) {
        this.formGroup.patchValue({
            weatherAppraisalStudy: res.weatherAppraisalStudy,
            attachSummaryFinding: res.attachSummaryFinding,
            financialProjectLifeTime: res.financialProjectLifeTime,
            economicProjectLifeTime: res.economicProjectLifeTime,
            financialDiscountFactor: res.financialDiscountFactor,
            economicDiscountFactor: res.economicDiscountFactor,
            financialNpv: res.financialNpv,
            economicNpv: res.economicNpv,
            financialBcr: res.financialBcr,
            economicBcr: res.economicBcr,
            fiancialIrr: res.fiancialIrr,
            economicIrr: res.economicIrr,
        })
    }

    /* For opening success message */
    openSnackBar(message: string, action: string): void {
        this._snackBar.open(message, action, {
            duration: 3000,
        });
    }


    /*
    Upload Attachment File
     */
    uploadFile(file: FileList, attachmentType: any): any {
        this.file = file.item(0);
        if (attachmentType === 'economicAttachment') {
            this.saveAttachment(this.file, 'economicAttachment');
        }
        if (attachmentType === 'financialAttachment') {
            this.saveAttachment(this.file, 'financialAttachment');
        }
        if (attachmentType === 'attachSummaryFinding') {
            this.saveAttachment(this.file, 'attachSummaryFinding');
        }

    }


    /*
   Save Attachment
    */
    saveAttachment(file: File, attachmentType: any): any {
        this.fileUploadService.uploadFileDppService(file).subscribe(res => {
            if (attachmentType === 'economicAttachment') {
                this.economicAttachmentId = res.id;
                console.log(this.economicAttachmentId);
            }
            if (attachmentType === 'financialAttachment') {
                this.financialAttachmentId = res.id
                console.log(this.financialAttachmentId);
            }
            if (attachmentType === 'attachSummaryFinding') {
                this.summaryFindingAttachmentId = res.id
                console.log(this.summaryFindingAttachmentId);
            }
            this.snackbarHelper.openSuccessSnackBarWithMessage('Attachment Successfully Save', 'Ok');

        }, err => {
            this.snackbarHelper.openErrorSnackBarWithMessage('Error File is not save', 'Ok');
        });
    }

    /*
   Download Attachment
    */

    summaryFindingAttachmentDownload() {
        this.fileUploadService.getAttachmentByIdInDppService(this.summaryFindingAttachmentId).subscribe(res => {
            this.fileUploadService.downloadAttachmentInDppService(res.pathUrl);
        });
    }

    financialAttachmentDownload() {
        this.fileUploadService.getAttachmentByIdInDppService(this.financialAttachmentId).subscribe(res => {
            this.fileUploadService.downloadAttachmentInDppService(res.pathUrl);
        });

    }

    economicAttachmentDownload() {
        this.fileUploadService.getAttachmentByIdInDppService(this.economicAttachmentId).subscribe(res => {
            this.fileUploadService.downloadAttachmentInDppService(res.pathUrl);
        });
    }


    uploadImageAsBase64(files: any, propertyName: string) {
        this.utilsService.uploadImageAsBase64(this.formGroup, files, propertyName);
    }

}
