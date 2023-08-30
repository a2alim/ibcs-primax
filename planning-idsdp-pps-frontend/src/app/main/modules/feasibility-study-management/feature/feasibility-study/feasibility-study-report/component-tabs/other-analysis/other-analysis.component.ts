import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {locale as lngEnglish} from './i18n/en';
import {locale as lngBangla} from './i18n/bn';
import {FuseTranslationLoaderService} from '../../../../../../../core/services/translation-loader.service';
import {OtherAnalysisModel} from '../../../../../models/other-analysis.model';
import {ActivatedRoute, Router} from '@angular/router';
import {SnackbarHelper} from '../../../../../../../core/helper/snackbar.helper';
import {OtherAnalysisService} from '../../../../../services/other-analysis.service';
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
    selector: 'app-other-analysis',
    templateUrl: './other-analysis.component.html',
    styleUrls: ['./other-analysis.component.scss']
})
export class OtherAnalysisComponent implements OnInit {

    minEditorConfig: any = MIN_EDITOR_CONFIG;
    mediumEditorConfig: any = MEDIUM_EDITOR_CONFIG;

    clickEventSubscription: Subscription;

    @Output() nextStep = new EventEmitter<boolean>();
    @Output() backPrevious = new EventEmitter<boolean>();

    formOtherAnalysis: FormGroup;

    model: OtherAnalysisModel = new OtherAnalysisModel();

    fsrMasterId: number;

    expHumanResource: boolean = true;
    expInstitutionalLegal: boolean = true;
    expRiskSensitivity: boolean = true;
    expAlternativeOptionsAnalysis: boolean = true;
    expRecommendationConclution: boolean = true;

    file: File;

    update: boolean;

    downloadEnable: boolean = false;

    uuid: string;
    attachUrl: string;

    attachmentName: string;
    isAttachmentNameEnable: boolean;

    spinner: boolean;

    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService, private formBuilder: FormBuilder,
                private route: ActivatedRoute,
                private router: Router,
                private otherAnalysisService: OtherAnalysisService,
                private feasibilityProposalHelperService: FeasibilityProposalHelperService,
                private utilsService: UtilsService,
                private fileUploadService: FileUploadService,
                private fsService: FeasibilityStudySummaryService,
                private snackBar: SnackbarHelper) {
        this.clickEventSubscription = this.otherAnalysisService.getFeasibilitySummarySaveEvent().subscribe(() => {
            this.loadData();
        });

        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }


    uploadImageAsBase64(files: any, propertyName: string) {
        this.utilsService.uploadImageAsBase64(this.formOtherAnalysis, files, propertyName);
    }


    //For form initial
    ngOnInit(): void {
        this.formOtherAnalysis = this.formBuilder.group({
            humanResource: new FormControl(''),
            institutionalLegal: new FormControl(''),
            riskSensitivity: new FormControl(''),
            alternativeOptionsAnalysis: new FormControl(''),
            recommendationConclution: new FormControl(''),
            attachmentOtherAnalysis: new FormControl(''),
        });
        this.getFSByPcUuid();
    }

    loadData(): void {
        this.fsrMasterId = this.feasibilityProposalHelperService.feasibilityReportCreateId;
        if (this.fsrMasterId > 0) {
            this.getOtherAnalysisByPcUuid();
        }
    }

    private getFSByPcUuid() {
        this.spinner = true;
        this.fsService.getFsSummaryByPcUuid(this.route.snapshot.paramMap.get('uuid')).subscribe(res => {
            if (res) {
                this.fsrMasterId = res.id;
                this.getOtherAnalysisByPcUuid();
            }
            this.spinner = false;
        });
    }

    //For attachment
    selectedFile(file: FileList): any {
        this.file = file.item(0);
        this.isAttachmentNameEnable = false;
        this.attachmentName = "";
    }

    //For create other analysis
    saveAndExit(): void {
        const humanResourceAnalysis = this.formOtherAnalysis.value.humanResource;
        const institutionalAnalysis = this.formOtherAnalysis.value.institutionalLegal;
        const riskSensitivityAnalysis = this.formOtherAnalysis.value.riskSensitivity;
        const alternativesAnalysis = this.formOtherAnalysis.value.alternativeOptionsAnalysis;
        const recommendationConclution = this.formOtherAnalysis.value.recommendationConclution;
        const fsrMasterId = this.fsrMasterId;

        this.spinner = true;
        // tslint:disable-next-line:max-line-length
        this.otherAnalysisService.createOtherAnalysis(humanResourceAnalysis, institutionalAnalysis, riskSensitivityAnalysis, alternativesAnalysis, recommendationConclution, this.file, fsrMasterId).subscribe(res => {
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

    //For get other analysis
    getOtherAnalysisByPcUuid(): any {
        this.otherAnalysisService.getOtherAnalysisByPcUuid(this.fsrMasterId).subscribe(res => {
            if (res) {
                this.update = true;
                this.setValueFromTechnicalAnalysis(res);
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

    //For set other analysis form value
    setValueFromTechnicalAnalysis(res: any) {
        if (res.attachment != null) {
            this.formOtherAnalysis.patchValue({
                humanResource: res.humanResourceAnalysis,
                institutionalLegal: res.institutionalAnalysis,
                riskSensitivity: res.riskSensitivityAnalysis,
                alternativeOptionsAnalysis: res.alternativesAnalysis,
                recommendationConclution: res.recommendationConclution,
                attachmentOtherAnalysis: res.attachment.uuid
            });
        } else {
            this.formOtherAnalysis.patchValue({
                humanResource: res.humanResourceAnalysis,
                institutionalLegal: res.institutionalAnalysis,
                riskSensitivity: res.riskSensitivityAnalysis,
                alternativeOptionsAnalysis: res.alternativesAnalysis,
                recommendationConclution: res.recommendationConclution
            });
        }
    }

    //For other analysis update
    updateAndExit() {
        const humanResourceAnalysis = this.formOtherAnalysis.value.humanResource;
        const institutionalAnalysis = this.formOtherAnalysis.value.institutionalLegal;
        const riskSensitivityAnalysis = this.formOtherAnalysis.value.riskSensitivity;
        const alternativesAnalysis = this.formOtherAnalysis.value.alternativeOptionsAnalysis;
        const recommendationConclution = this.formOtherAnalysis.value.recommendationConclution;
        const fsrMasterId = this.fsrMasterId;

        this.spinner = true;
        // tslint:disable-next-line:max-line-length
        this.otherAnalysisService.updateOtherAnalysis(humanResourceAnalysis, institutionalAnalysis, riskSensitivityAnalysis, alternativesAnalysis, recommendationConclution, this.file, fsrMasterId).subscribe(res => {
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

    //For other analysis attachment download
    download() {
        // const url = environment.ibcs.ppsFsBaseEndPoint;
        // window.open(url + this.attachUrl);
        this.fileUploadService.downloadAttachmentInFsService(this.attachUrl);
    }

    //For attachment delete
    delete(value: string) {
        this.formOtherAnalysis.controls[value].setValue(null, {emitEvent: false});
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
            this.expHumanResource = true;
        }
        if (i === 2) {
            this.expInstitutionalLegal = true;
        }
        if (i === 3) {
            this.expRiskSensitivity = true;
        }
        if (i === 4) {
            this.expAlternativeOptionsAnalysis = true;
        }
        if (i === 5) {
            this.expRecommendationConclution = true;
        }
    }

    /**
     * For Collapsing CK Editor
     * @param i
     */
    collapse(i: number): void {
        if (i === 1) {
            this.expHumanResource = false;
        }
        if (i === 2) {
            this.expInstitutionalLegal = false;
        }
        if (i === 3) {
            this.expRiskSensitivity = false;
        }
        if (i === 4) {
            this.expAlternativeOptionsAnalysis = false;
        }
        if (i === 5) {
            this.expRecommendationConclution = false;
        }
    }

    //For go to previous tab
    back(): void {
        this.backPrevious.emit(true);
    }


}
