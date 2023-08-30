import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {locale as lngEnglish} from './i18n/en';
import {locale as lngBangla} from './i18n/bn';
import {FuseTranslationLoaderService} from '../../../../../../../core/services/translation-loader.service';
import {RiskAnalysisModel} from '../../../../../models/risk-analysis.model';
import {ActivatedRoute, Router} from '@angular/router';
import {SnackbarHelper} from '../../../../../../../core/helper/snackbar.helper';
import {RiskAnalysisService} from '../../../../../services/risk-analysis.service';
import {environment} from '../../../../../../../../../environments/environment';
import {ERROR, OK} from '../../../../../../../core/constants/message';
import {Subscription} from 'rxjs';
import {FeasibilityProposalHelperService} from '../../../../../services/feasibility-proposal-helper.service';
import {MEDIUM_EDITOR_CONFIG, MIN_EDITOR_CONFIG} from '../../../../../../../core/constants/editor-config';
import {UtilsService} from 'app/main/core/services/utils.service';
import {FileUploadService} from "../../../../../../../core/services/file-upload.service";
import {FeasibilityStudySummaryService} from "../../../../../services/feasibility-study-summary.service";

@Component({
    selector: 'app-risk-analysis',
    templateUrl: './risk-analysis.component.html',
    styleUrls: ['./risk-analysis.component.scss']
})
export class RiskAnalysisComponent implements OnInit {

    minEditorConfig: any = MIN_EDITOR_CONFIG;
    mediumEditorConfig: any = MEDIUM_EDITOR_CONFIG;

    clickEventSubscription: Subscription;

    @Output() nextStep = new EventEmitter<boolean>();
    @Output() backPrevious = new EventEmitter<boolean>();

    formRiskAnalysis: FormGroup;

    model: RiskAnalysisModel = new RiskAnalysisModel();

    file: File;

    update: boolean;

    downloadEnable: boolean = false;

    fsrMasterId: number;

    expEnvironmentalClimateChange: boolean = true;
    expAssessmentOfDisaster: boolean = true;

    uuid: string;
    attachUrl: string;

    attachmentName: string;
    isAttachmentNameEnable: boolean;

    spinner: boolean;

    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService, private formBuilder: FormBuilder,
                private route: ActivatedRoute,
                private router: Router,
                private riskAnalysisService: RiskAnalysisService,
                private feasibilityProposalHelperService: FeasibilityProposalHelperService,
                private utilsService: UtilsService,
                private fileUploadService: FileUploadService,
                private fsService: FeasibilityStudySummaryService,
                private snackBar: SnackbarHelper) {
        this.clickEventSubscription = this.riskAnalysisService.getFeasibilitySummarySaveEvent().subscribe(() => {
            this.loadData();
        });
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

    //For form initial
    ngOnInit(): void {
        this.formRiskAnalysis = this.formBuilder.group({
            environmentalClimateChange: new FormControl(''),
            assessmentOfDisaster: new FormControl(''),
            attachmentRiskAnalysis: new FormControl(''),
        });
        this.getFSByPcUuid();
    }

    private getFSByPcUuid() {
        this.spinner = true;
        this.fsService.getFsSummaryByPcUuid(this.route.snapshot.paramMap.get('uuid')).subscribe(res => {
            if (res) {
                this.fsrMasterId = res.id;
                this.getRiskAnalysisByPcUuid();
            }
            this.spinner = false;
        });
    }

    loadData(): void {
        this.fsrMasterId = this.feasibilityProposalHelperService.feasibilityReportCreateId;
        if (this.fsrMasterId > 0) {
            this.getRiskAnalysisByPcUuid();
        }
    }

    uploadImageAsBase64(files: any, propertyName: string) {
        this.utilsService.uploadImageAsBase64(this.formRiskAnalysis, files, propertyName);
    }

    //For attachment
    selectedFile(file: FileList): any {
        this.file = file.item(0);
        this.isAttachmentNameEnable = false;
        this.attachmentName = "";
    }

    //For create risk analysis
    saveAndNext(): void {
        const envClimateChangeAnalysis = this.formRiskAnalysis.value.environmentalClimateChange;
        const assessmentDisasterResilienceProject = this.formRiskAnalysis.value.assessmentOfDisaster;
        const fsrMasterId = this.fsrMasterId;

        this.spinner = true;
        this.riskAnalysisService.createRiskAnalysis(envClimateChangeAnalysis, assessmentDisasterResilienceProject, this.file, fsrMasterId).subscribe(res => {
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

    //For create risk analysis
    saveAndExit(): void {
        const envClimateChangeAnalysis = this.formRiskAnalysis.value.environmentalClimateChange;
        const assessmentDisasterResilienceProject = this.formRiskAnalysis.value.assessmentOfDisaster;
        const fsrMasterId = this.fsrMasterId;

        this.spinner = true;
        this.riskAnalysisService.createRiskAnalysis(envClimateChangeAnalysis, assessmentDisasterResilienceProject, this.file, fsrMasterId).subscribe(res => {
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

    //For get risk analysis
    getRiskAnalysisByPcUuid(): any {
        this.riskAnalysisService.getRiskAnalysisByPcUuid(this.fsrMasterId).subscribe(res => {
            if (res) {
                this.update = true;
                this.setValueFromRiskAnalysis(res);
                this.uuid = res.uuid;
                if (res.attachment != null) {
                    this.downloadEnable = true;
                    this.attachUrl = res.attachment.urlPath;
                    this.attachmentName = res.attachment.fileName;
                    this.isAttachmentNameEnable = true;
                }
            }
        });
    }

    //For set risk analysis form value
    setValueFromRiskAnalysis(res: any) {
        if (res.attachment != null) {
            this.formRiskAnalysis.patchValue({
                environmentalClimateChange: res.envClimateChangeAnalysis,
                assessmentOfDisaster: res.assessmentDisasterResilienceProject,
                attachmentRiskAnalysis: res.attachment.uuid
            });
        } else {
            this.formRiskAnalysis.patchValue({
                environmentalClimateChange: res.envClimateChangeAnalysis,
                assessmentOfDisaster: res.assessmentDisasterResilienceProject
            });
        }

    }

    //For update risk analysis
    updateAndNext() {
        const envClimateChangeAnalysis = this.formRiskAnalysis.value.environmentalClimateChange;
        const assessmentDisasterResilienceProject = this.formRiskAnalysis.value.assessmentOfDisaster;
        const fsrMasterId = this.fsrMasterId;

        this.spinner = true;
        this.riskAnalysisService.updateRiskAnalysis(envClimateChangeAnalysis, assessmentDisasterResilienceProject, this.file, fsrMasterId).subscribe(res => {
            if (res.status === 201) {
                this.snackBar.openSuccessSnackBarWithMessage('Successfully Update Data', OK);
                this.spinner = false;
                this.nextStep.emit(true);
            }
        }, err => {
            this.spinner = false;
            this.snackBar.openErrorSnackBarWithMessage('Failed to update data', ERROR);
        });
    }

    //For update risk analysis
    updateAndExit() {
        const envClimateChangeAnalysis = this.formRiskAnalysis.value.environmentalClimateChange;
        const assessmentDisasterResilienceProject = this.formRiskAnalysis.value.assessmentOfDisaster;
        const fsrMasterId = this.fsrMasterId;

        this.spinner = true;
        this.riskAnalysisService.updateRiskAnalysis(envClimateChangeAnalysis, assessmentDisasterResilienceProject, this.file, fsrMasterId).subscribe(res => {
            if (res.status === 201) {
                this.snackBar.openSuccessSnackBarWithMessage('Successfully Update Data', OK);
                this.spinner = false;
                this.router.navigate([`feasibility-study`]);
            }
        }, err => {
            this.spinner = false;
            this.snackBar.openErrorSnackBarWithMessage('Failed to update data', ERROR);
        });
    }

    //for attachment download
    download() {
        // const url = environment.ibcs.ppsFsBaseEndPoint;
        // console.log(url + this.attachUrl);
        // window.open(url + this.attachUrl);
        this.fileUploadService.downloadAttachmentInFsService(this.attachUrl);
    }

    //For attachment delete
    delete(value: string) {
        this.formRiskAnalysis.patchValue({attachmentRiskAnalysis: null}, {emitEvent: false});
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
            this.expEnvironmentalClimateChange = true;
        }
        if (i === 2) {
            this.expAssessmentOfDisaster = true;
        }
    }

    /**
     * For Collapsing CK Editor
     * @param i
     */
    collapse(i: number): void {
        if (i === 1) {
            this.expEnvironmentalClimateChange = false;
        }
        if (i === 2) {
            this.expAssessmentOfDisaster = false;
        }
    }

    //For go to previous tab
    back(): void {
        this.backPrevious.emit(true);
    }

}
