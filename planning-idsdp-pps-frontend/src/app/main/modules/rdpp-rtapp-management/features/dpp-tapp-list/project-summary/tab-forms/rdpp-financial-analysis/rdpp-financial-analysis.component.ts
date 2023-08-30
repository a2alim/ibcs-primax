import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {FuseTranslationLoaderService} from "../../../../../../../core/services/translation-loader.service";
import {BsModalService} from "ngx-bootstrap/modal";
import {ActivatedRoute, Router} from "@angular/router";
import {SnackbarHelper} from "../../../../../../../core/helper/snackbar.helper";
import {FileUploadService} from "../../../../../../../core/services/file-upload.service";
import {locale as lngEnglish} from './i18n/en';
import {locale as lngBangla} from './i18n/bn';
import {FinancialAnalysisService} from "../../../project-details/services/financial-analysis.service";
import {SUCCESSFULLY_SAVE, SUCCESSFULLY_SAVE_BN} from "../../../../../../../core/constants/message";
import {
    FinancialAnalysis
} from "../../../../../../dpp-tapp-management/features/dpp-tapp-list/project-details/models/financial-analysis.model";
import {RdppObjectiveCostService} from "../../../../../services/rdpp-objective-cost.service";
import {RdppFinancialAnalysis} from "../../../../../models/rdpp-financial-analysis.model";
import {UtilsService} from "../../../../../../../core/services/utils.service";
import {MEDIUM_EDITOR_CONFIG, MIN_EDITOR_CONFIG} from "../../../../../../../core/constants/editor-config";

@Component({
  selector: 'app-rdpp-financial-analysis',
  templateUrl: './rdpp-financial-analysis.component.html',
  styleUrls: ['./rdpp-financial-analysis.component.scss']
})
export class RdppFinancialAnalysisComponent implements OnInit {
    formGroup: FormGroup;
    isUpdate: boolean;
    buttonDisable: boolean;
    uuid: string;
    rdppMasterId: number;
    pcUuid: string;
    pcId: number;
    financialAnalysis: RdppFinancialAnalysis = new RdppFinancialAnalysis();
    file: File;
    financialAttachmentId: number;
    economicAttachmentId: number;
    financialAttachmentName: string;
    economicAttachmentName: string;
    isJustification: boolean = true;
    isCumulativeExpenditure: boolean = true;

    minEditorConfig: any = MIN_EDITOR_CONFIG;
    mediumEditorConfig: any = MEDIUM_EDITOR_CONFIG;
    financialAnalysisServiceData: any;

    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
                private modalService: BsModalService,
                private _formBuilder: FormBuilder,
                private route: ActivatedRoute,
                private router: Router,
                private snackbarHelper: SnackbarHelper,
                private fileUploadService: FileUploadService,
                private financialAnalysisService: FinancialAnalysisService,
                private rdppService: RdppObjectiveCostService,
                private utilsService: UtilsService
    ) {
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla)
    }

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            this.pcUuid = params['pcUuid'];
            this.rdppMasterId = params['id'];
        });
        this.loadFormValue();
        this.getRdppMasterData();
        this.getFinancialAnalysis();
    }


    loadFormValue() {
        this.formGroup = this._formBuilder.group({
            financialNpv: [''],
            economicNpv: [''],
            financialBcr: [''],
            economicBcr: [''],
            financialIrr: [''],
            economicIrr: [''],
            mainFeaturesOfRevision: [''],
            cumulativeExpenditure: [''],
            financialAttachment: [''],
            economicAttachment: ['']
        });
    }

    getRdppMasterData() {
        this.rdppService.getByProjectConceptUuidAndId(this.pcUuid, this.rdppMasterId).subscribe(res => {
            this.pcId = res.res.projectConceptMasterId;
        })
    }

    onSubmit() {
        if (this.isUpdate) {
            this.update();
        } else {
            this.save();
        }
    }

    save() {
        if (this.formGroup.valid) {
            this.saveFinancialAnalysis();
        }
    }

    saveAndExit() {
        if (this.formGroup.valid) {
            this.saveFinancialAnalysis();
            let routeUrl = 'rdpp-rtapp/dashboard';
            this.router.navigate([routeUrl], {queryParams: {pcUuid: this.pcUuid, id: this.rdppMasterId}});
        }
    }

    saveFinancialAnalysis(): any {
        this.convertFormToDto();
        this.financialAnalysisService.saveFinancialAnalysis(this.financialAnalysis).subscribe(res => {
            this.getFinancialAnalysis();
            this.snackbarHelper.openSuccessSnackBarWithMessageEnBn(SUCCESSFULLY_SAVE, SUCCESSFULLY_SAVE_BN);
        })
    }

    update() {
        if (this.formGroup.valid) {
            this.updateFinancialAnalysis();
        }
    }

    updateAndExit() {
        if (this.formGroup.valid) {
            this.updateFinancialAnalysis();
            let routeUrl = 'rdpp-rtapp/dashboard';
            this.router.navigate([routeUrl], {queryParams: {pcUuid: this.pcUuid, id: this.rdppMasterId}});
        }
    }

    updateFinancialAnalysis(): any {
        this.convertFormToDto();
        this.financialAnalysisService.updateFinancialAnalysis(this.financialAnalysis, this.pcUuid).subscribe(res => {
            this.getFinancialAnalysis();
            this.snackbarHelper.openSuccessSnackBarWithMessageEnBn(SUCCESSFULLY_SAVE, SUCCESSFULLY_SAVE_BN);
        })
    }

    convertFormToDto(): any {
        this.financialAnalysis.financialProjectLifeTime = this.formGroup.value.financialProjectLifeTime;
        this.financialAnalysis.economicProjectLifeTime = this.formGroup.value.economicProjectLifeTime;
        this.financialAnalysis.financialDiscountFactor = this.formGroup.value.financialDiscountFactor;
        this.financialAnalysis.economicDiscountFactor = this.formGroup.value.economicDiscountFactor;
        this.financialAnalysis.financialNpv = this.formGroup.value.financialNpv;
        this.financialAnalysis.economicNpv = this.formGroup.value.economicNpv;
        this.financialAnalysis.financialBcr = this.formGroup.value.financialBcr;
        this.financialAnalysis.economicBcr = this.formGroup.value.economicBcr;
        this.financialAnalysis.financialIrr = Number(this.formGroup.value.financialIrr);
        this.financialAnalysis.economicIrr = this.formGroup.value.economicIrr;
        this.financialAnalysis.projectConceptUuid = this.pcUuid;
        this.financialAnalysis.projectConceptMasterId = this.pcId;
        this.financialAnalysis.mainFeaturesOfRevision = this.formGroup.value.mainFeaturesOfRevision;
        this.financialAnalysis.cumulativeExpenditure = this.formGroup.value.cumulativeExpenditure;
        this.financialAnalysis.economicAnalysisAttachmentId = this.economicAttachmentId;
        this.financialAnalysis.financialAnalysisAttachmentId = this.financialAttachmentId;
    }

    getFinancialAnalysis() {
        this.financialAnalysisService.getFinancialAnalysis(this.pcUuid).subscribe((response) => {
            this.financialAnalysisServiceData = response;
            if (response.status == 200) {
                this.isUpdate = true;
                this.uuid = response.res.uuid;
                this.setFinancialAnalysis(response.res);
                if (response.res.financialAttachmentId != null) {
                    this.financialAttachmentId = response.res.financialAttachmentId.id;
                    this.financialAttachmentName = response.res.financialAttachmentId.name;
                }
                if (response.res.economicAttachmentId != null) {
                    this.economicAttachmentId = response.res.economicAttachmentId.id;
                    this.economicAttachmentName = response.res.economicAttachmentId.name;
                }
            } else {
                this.isUpdate = false;
            }
        }, error => {
        })
    }

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
            financialIrr: res.financialIrr,
            economicIrr: res.economicIrr,
            mainFeaturesOfRevision: res.mainFeaturesOfRevision,
            cumulativeExpenditure: res.cumulativeExpenditure,
            financialAttachment: res.financialAttachmentId,
            economicAttachment: res.economicAttachmentId
        })
    }

    onSubmitAndExit() {
        if (this.isUpdate) {
            this.updateAndExit();
        } else {
            this.saveAndExit();
        }
    }

    uploadFile(file: FileList, attachmentType: any): any {
        this.file = file.item(0);
        if (attachmentType === 'economicAttachment') {
            this.saveAttachment(this.file, 'economicAttachment');
        }
        if (attachmentType === 'financialAttachment') {
            this.saveAttachment(this.file, 'financialAttachment');
        }
    }

    saveAttachment(file: File, attachmentType: any): any {
        this.fileUploadService.uploadFileRdppService(file).subscribe(res => {
            if (attachmentType === 'financialAttachment') {
                this.financialAttachmentId = res.id;
                this.financialAttachmentName = "";
            }
            if (attachmentType === 'economicAttachment') {
                this.economicAttachmentId = res.id;
                this.economicAttachmentName = "";
            }
            this.snackbarHelper.openSuccessSnackBarWithMessage('Attachment Successfully Save', 'Ok');

        }, err => {
            this.snackbarHelper.openErrorSnackBarWithMessage('Error File is not save', 'Ok');
        });
    }

    financialAttachmentDownload() {
        this.fileUploadService.getAttachmentByIdInRdppService(this.financialAttachmentId).subscribe(res => {
            this.fileUploadService.downloadAttachmentInRdppService(res.pathUrl);
        });
    }

    economicAttachmentDownload() {
        this.fileUploadService.getAttachmentByIdInRdppService(this.economicAttachmentId).subscribe(res => {
            this.fileUploadService.downloadAttachmentInRdppService(res.pathUrl);
        });
    }

    expandOrCollapse() {
        this.isJustification = !this.isJustification;
    }

    expandOrCollapseExpenditure() {
        this.isCumulativeExpenditure = !this.isCumulativeExpenditure;
    }

}
