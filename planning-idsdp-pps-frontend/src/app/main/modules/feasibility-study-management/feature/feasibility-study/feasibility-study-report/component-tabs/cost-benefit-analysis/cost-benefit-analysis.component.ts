import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {FuseTranslationLoaderService} from '../../../../../../../core/services/translation-loader.service';
import {locale as lngEnglish} from './i18n/en';
import {locale as lngBangla} from './i18n/bn';
import {CostBenefitAnalysisModel} from '../../../../../models/cost-benefit-analysis.model';
import {ActivatedRoute, Router} from '@angular/router';
import {SnackbarHelper} from '../../../../../../../core/helper/snackbar.helper';
import {CostBenefitAnalysisService} from '../../../../../services/cost-benefit-analysis.service';
import {environment} from '../../../../../../../../../environments/environment';
import {ERROR, OK} from '../../../../../../../core/constants/message';
import {Subscription} from 'rxjs';
import {FeasibilityProposalHelperService} from '../../../../../services/feasibility-proposal-helper.service';
import {
    MIN_EDITOR_CONFIG,
    MEDIUM_EDITOR_CONFIG
} from '../../../../../../../core/constants/editor-config';
import {UtilsService} from 'app/main/core/services/utils.service';
import {FeasibilityStudySummaryService} from "../../../../../services/feasibility-study-summary.service";
import {FileUploadService} from "../../../../../../../core/services/file-upload.service";

@Component({
    selector: 'app-cost-benefit-analysis',
    templateUrl: './cost-benefit-analysis.component.html',
    styleUrls: ['./cost-benefit-analysis.component.scss']
})
export class CostBenefitAnalysisComponent implements OnInit {

    minEditorConfig: any = MIN_EDITOR_CONFIG;
    mediumEditorConfig: any = MEDIUM_EDITOR_CONFIG;

    clickEventSubscription: Subscription;

    @Output() nextStep = new EventEmitter<boolean>();
    @Output() backPrevious = new EventEmitter<boolean>();

    form: FormGroup;

    model: CostBenefitAnalysisModel = new CostBenefitAnalysisModel();

    file: File;

    fsrMasterId: number;

    expFinancialAnalysis: boolean = true;
    expEconomicAnalysis: boolean = true;

    update: boolean;

    downloadEnable: boolean = false;

    uuid: string;
    attachUrl: string;

    attachmentName: string;
    isAttachmentNameEnable: boolean;

    spinner: boolean;

    constructor(private fuseTranslationLoaderService: FuseTranslationLoaderService,
                private route: ActivatedRoute,
                private router: Router,
                private costBenefitAnalysisService: CostBenefitAnalysisService,
                private feasibilityProposalHelperService: FeasibilityProposalHelperService,
                private utilsService: UtilsService,
                private fileUploadService: FileUploadService,
                private fsService: FeasibilityStudySummaryService,
                private snackBar: SnackbarHelper) {
        this.clickEventSubscription = this.costBenefitAnalysisService.getFeasibilitySummarySaveEvent().subscribe(() => {
            this.loadData();
        });
        this.fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

    //For form initial
    ngOnInit(): void {
        this.populateForm();
        this.getFSByPcUuid();
    }

    private getFSByPcUuid() {
        this.spinner = true;
        this.fsService.getFsSummaryByPcUuid(this.route.snapshot.paramMap.get('uuid')).subscribe(res => {
            if (res) {
                this.fsrMasterId = res.id;
                this.getCostBenefitAnalysisByPcUuid();
            }
            this.spinner = false;
        });
    }

    // load all api data
    loadData(): void {
        this.fsrMasterId = this.feasibilityProposalHelperService.feasibilityReportCreateId;
        if (this.fsrMasterId > 0) {
            this.getCostBenefitAnalysisByPcUuid();
        }
    }

    uploadImageAsBase64(files: any, propertyName: string) {
        this.utilsService.uploadImageAsBase64(this.form, files, propertyName);
    }

    //For form population in project start mode
    private populateForm(): void {
        this.form = new FormGroup({
            financialAnalysis: new FormControl(''),
            financialNetPresentValue: new FormControl('', [Validators.required]),
            financialBenefitCostRatio: new FormControl('', [Validators.required]),
            financialInternalRateOfReturn: new FormControl('', [Validators.required]),
            economicAnalysis: new FormControl(''),
            economicNetPresentValue: new FormControl('', [Validators.required]),
            economicBenefitCostRatio: new FormControl('', [Validators.required]),
            economicInternalRateOfReturn: new FormControl('', [Validators.required]),
            attachment: new FormControl(''),
        });
    }

    //For selected file
    selectedFile(file: FileList): any {
        this.file = file.item(0);
        this.isAttachmentNameEnable = false;
        this.attachmentName = "";
    }

    //For create cost benefit
    saveAndNext(): void {
        const financialAnalysis = this.form.value.financialAnalysis;
        const financialNetPresentVal = this.form.value.financialNetPresentValue;
        const financialBenefitCostRatio = this.form.value.financialBenefitCostRatio;
        const financialInternalRateReturn = this.form.value.financialInternalRateOfReturn;
        const economicAnalysis = this.form.value.economicAnalysis;
        const economicNetPresentVal = this.form.value.economicNetPresentValue;
        const economicBenefitCostRatio = this.form.value.economicBenefitCostRatio;
        const economicInternalRateReturn = this.form.value.economicInternalRateOfReturn;
        const fsrMasterId = this.fsrMasterId;

        this.spinner = true;
        // tslint:disable-next-line:max-line-length
        this.costBenefitAnalysisService.createCostBenefitAnalysis(financialAnalysis, financialNetPresentVal, financialBenefitCostRatio, financialInternalRateReturn, economicAnalysis, economicNetPresentVal, economicBenefitCostRatio, economicInternalRateReturn, this.file, fsrMasterId).subscribe(res => {
            if (res.status === 201) {
                this.snackBar.openSuccessSnackBar();
                this.spinner = false;
                this.nextStep.emit(true);
            }
        }, err => {
            this.spinner = false;
            this.snackBar.openErrorSnackBar();
        });
    }

    //For create cost benefit
    saveAndExit(): void {
        const financialAnalysis = this.form.value.financialAnalysis;
        const financialNetPresentVal = this.form.value.financialNetPresentValue;
        const financialBenefitCostRatio = this.form.value.financialBenefitCostRatio;
        const financialInternalRateReturn = this.form.value.financialInternalRateOfReturn;
        const economicAnalysis = this.form.value.economicAnalysis;
        const economicNetPresentVal = this.form.value.economicNetPresentValue;
        const economicBenefitCostRatio = this.form.value.economicBenefitCostRatio;
        const economicInternalRateReturn = this.form.value.economicInternalRateOfReturn;
        const fsrMasterId = this.fsrMasterId;

        this.spinner = true;
        // tslint:disable-next-line:max-line-length
        this.costBenefitAnalysisService.createCostBenefitAnalysis(financialAnalysis, financialNetPresentVal, financialBenefitCostRatio, financialInternalRateReturn, economicAnalysis, economicNetPresentVal, economicBenefitCostRatio, economicInternalRateReturn, this.file, fsrMasterId).subscribe(res => {
            if (res.status === 201) {
                this.snackBar.openSuccessSnackBar();
                this.spinner = false;
                this.router.navigate([`feasibility-study`]);
            }
        }, err => {
            this.spinner = false;
            this.snackBar.openErrorSnackBar();
        });
    }

    //For get cost benefit by pc uuid
    getCostBenefitAnalysisByPcUuid(): any {
        this.costBenefitAnalysisService.getCostBenefitAnalysisByPcUuid(this.fsrMasterId).subscribe(res => {
            if (res) {
                this.update = true;
                this.setValueFromCostBenefitAnalysis(res);
                this.uuid = res.uuid;
                if (res.attachment != null) {
                    this.downloadEnable = true;
                    this.attachUrl = res.attachment.urlPath;
                    this.attachmentName = res.attachment.fileName;
                    this.isAttachmentNameEnable = true;
                }
                // this.downloadAttachment(this.attachUrl);
            }
        });
    }

    //For set cost benefit form value in update mode
    setValueFromCostBenefitAnalysis(res: any) {
        if (res.attachment != null) {
            this.form.patchValue({
                financialAnalysis: res.financialAnalysis,
                financialNetPresentValue: res.financialNetPresentVal,
                financialBenefitCostRatio: res.financialBenefitCostRatio,
                financialInternalRateOfReturn: res.financialInternalRateReturn,
                economicAnalysis: res.economicAnalysis,
                economicNetPresentValue: res.economicNetPresentVal,
                economicBenefitCostRatio: res.economicBenefitCostRatio,
                economicInternalRateOfReturn: res.economicInternalRateReturn,
                attachment: res.attachment.uuid
            });
        } else {
            this.form.patchValue({
                financialAnalysis: res.financialAnalysis,
                financialNetPresentValue: res.financialNetPresentVal,
                financialBenefitCostRatio: res.financialBenefitCostRatio,
                financialInternalRateOfReturn: res.financialInternalRateReturn,
                economicAnalysis: res.economicAnalysis,
                economicNetPresentValue: res.economicNetPresentVal,
                economicBenefitCostRatio: res.economicBenefitCostRatio,
                economicInternalRateOfReturn: res.economicInternalRateReturn
            });
        }
    }

    //For attachment download
    download() {
        // const url = environment.ibcs.ppsFsBaseEndPoint;
        // window.open(url + this.attachUrl);
        this.fileUploadService.downloadAttachmentInFsService(this.attachUrl);
    }

    //For update financial analysis
    updateAndNext() {
        const financialAnalysis = this.form.value.financialAnalysis;
        const financialNetPresentVal = this.form.value.financialNetPresentValue;
        const financialBenefitCostRatio = this.form.value.financialBenefitCostRatio;
        const financialInternalRateReturn = this.form.value.financialInternalRateOfReturn;
        const economicAnalysis = this.form.value.economicAnalysis;
        const economicNetPresentVal = this.form.value.economicNetPresentValue;
        const economicBenefitCostRatio = this.form.value.economicBenefitCostRatio;
        const economicInternalRateReturn = this.form.value.economicInternalRateOfReturn;
        const fsrMasterId = this.fsrMasterId;

        this.spinner = true;
        // tslint:disable-next-line:max-line-length
        this.costBenefitAnalysisService.updateCostBenefitAnalysis(financialAnalysis, financialNetPresentVal, financialBenefitCostRatio, financialInternalRateReturn, economicAnalysis, economicNetPresentVal, economicBenefitCostRatio, economicInternalRateReturn, this.file, fsrMasterId).subscribe(res => {
            if (res.status === 201) {
                this.snackBar.openSuccessSnackBarWithMessage('Successfully Update Data', OK);
                this.spinner = false;
                this.nextStep.emit(true);
            }
        }, err => {
            this.spinner = false;
            this.snackBar.openErrorSnackBarWithMessage('Failed to update data', OK);
        });
    }

    //For update financial analysis
    updateAndExit() {
        const financialAnalysis = this.form.value.financialAnalysis;
        const financialNetPresentVal = this.form.value.financialNetPresentValue;
        const financialBenefitCostRatio = this.form.value.financialBenefitCostRatio;
        const financialInternalRateReturn = this.form.value.financialInternalRateOfReturn;
        const economicAnalysis = this.form.value.economicAnalysis;
        const economicNetPresentVal = this.form.value.economicNetPresentValue;
        const economicBenefitCostRatio = this.form.value.economicBenefitCostRatio;
        const economicInternalRateReturn = this.form.value.economicInternalRateOfReturn;
        const fsrMasterId = this.fsrMasterId;

        this.spinner = true;
        // tslint:disable-next-line:max-line-length
        this.costBenefitAnalysisService.updateCostBenefitAnalysis(financialAnalysis, financialNetPresentVal, financialBenefitCostRatio, financialInternalRateReturn, economicAnalysis, economicNetPresentVal, economicBenefitCostRatio, economicInternalRateReturn, this.file, fsrMasterId).subscribe(res => {
            if (res.status === 201) {
                this.snackBar.openSuccessSnackBarWithMessage('Successfully Update Data', OK);
                this.spinner = false;
                this.router.navigate([`feasibility-study`]);
            }
        }, err => {
            this.spinner = false;
            this.snackBar.openErrorSnackBarWithMessage('Failed to update data', OK);
        });
    }

    //For delete financial analysis attachment
    delete(value: string) {
        this.form.controls[value].setValue(null, {emitEvent: false});
        this.file = null;
        this.downloadEnable = false;
        this.attachUrl = '';
        this.attachmentName = '';
        this.isAttachmentNameEnable = false;
    }

    /**
     * For Expanding CK Editor
     * @param i
     */
    expand(i: number): void {
        if (i === 1) {
            this.expFinancialAnalysis = true;
        }
        if (i === 2) {
            this.expEconomicAnalysis = true;
        }
    }

    /**
     * For Collapsing CK Editor
     * @param i
     */
    collapse(i: number): void {
        if (i === 1) {
            this.expFinancialAnalysis = false;
        }
        if (i === 2) {
            this.expEconomicAnalysis = false;
        }
    }

    //For go to previous tab
    back(): void {
        this.backPrevious.emit(true);
    }
}
