import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {locale as lngEnglish} from './i18n/en';
import {locale as lngBangla} from './i18n/bn';
import {FuseTranslationLoaderService} from '../../../../../../../core/services/translation-loader.service';
import {ActivatedRoute, Router} from '@angular/router';
import {TechnicalAnalysisService} from '../../../../../services/technical-analysis.service';
import {SnackbarHelper} from '../../../../../../../core/helper/snackbar.helper';
import {TechnicalAnalysisModel} from '../../../../../models/technical-analysis.model';
import {environment} from '../../../../../../../../../environments/environment';
import {ERROR, OK} from '../../../../../../../core/constants/message';
import {Subscription} from 'rxjs';
import {FeasibilityProposalHelperService} from '../../../../../services/feasibility-proposal-helper.service';
import {MEDIUM_EDITOR_CONFIG, MIN_EDITOR_CONFIG} from '../../../../../../../core/constants/editor-config';
import {UtilsService} from 'app/main/core/services/utils.service';
import {FeasibilityStudySummaryService} from "../../../../../services/feasibility-study-summary.service";
import {FileUploadService} from "../../../../../../../core/services/file-upload.service";

@Component({
    selector: 'app-technical-technological-analysis',
    templateUrl: './technical-technological-analysis.component.html',
    styleUrls: ['./technical-technological-analysis.component.scss']
})
export class TechnicalTechnologicalAnalysisComponent implements OnInit {

    minEditorConfig: any = MIN_EDITOR_CONFIG;
    mediumEditorConfig: any = MEDIUM_EDITOR_CONFIG;

    clickEventSubscription: Subscription;

    @Output() nextStep = new EventEmitter<boolean>();
    @Output() backPrevious = new EventEmitter<boolean>();

    formTechnologicalAnalysis: FormGroup;
    model: TechnicalAnalysisModel = new TechnicalAnalysisModel();

    update: boolean;
    downloadEnable: boolean = false;

    fsrMasterId: number;

    expLocation: boolean = true;
    expTechnicalDesign: boolean = true;
    expOutputPlan: boolean = true;
    expCostEstimates: boolean = true;
    expImplementationTimeline: boolean = true;

    file: File;

    uuid: string;
    attachUrl: string;

    attachmentName: string;
    isAttachmentNameEnable: boolean;

    spinner: boolean;

    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService, private formBuilder: FormBuilder,
                private route: ActivatedRoute,
                private router: Router,
                private fsService: FeasibilityStudySummaryService,
                private fileUploadService: FileUploadService,
                private technicalAnalysisService: TechnicalAnalysisService,
                private feasibilityProposalHelperService: FeasibilityProposalHelperService,
                private utilsService: UtilsService,
                private snackBar: SnackbarHelper) {
        this.clickEventSubscription = this.technicalAnalysisService.getFeasibilitySummarySaveEvent().subscribe(() => {
            this.loadData();
        });
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

    //For form initial
    ngOnInit(): void {
        this.formTechnologicalAnalysis = this.formBuilder.group({
            location: new FormControl(''),
            technicalDesign: new FormControl(''),
            outputPlan: new FormControl(''),
            costEstimates: new FormControl(''),
            implementationTimeline: new FormControl(''),
            attachmentTechnologicalAnalysis: new FormControl(''),
        });
        this.getFSByPcUuid();
    }

    private getFSByPcUuid() {
        this.spinner = true;
        this.fsService.getFsSummaryByPcUuid(this.route.snapshot.paramMap.get('uuid')).subscribe(res => {
            if (res) {
                this.fsrMasterId = res.id;
                this.getTechnicalAnalysisByPcUuid();
            }
            this.spinner = false;
        });
    }


    uploadImageAsBase64(files: any, propertyName: string) {
        this.utilsService.uploadImageAsBase64(this.formTechnologicalAnalysis, files, propertyName);
    }

    loadData(): void {
        this.fsrMasterId = this.feasibilityProposalHelperService.feasibilityReportCreateId;
        if (this.fsrMasterId > 0) {
            this.getTechnicalAnalysisByPcUuid();
        }
    }

    //For attachment
    selectedFile(file: FileList): any {
        this.file = file.item(0);
        this.isAttachmentNameEnable = false;
        this.attachmentName = "";
    }

    //For create technical analysis
    saveAndNext() {
        const location = this.formTechnologicalAnalysis.value.location;
        const technicalDesign = this.formTechnologicalAnalysis.value.technicalDesign;
        const outputPlan = this.formTechnologicalAnalysis.value.outputPlan;
        const costEstimates = this.formTechnologicalAnalysis.value.costEstimates;
        const impTimeline = this.formTechnologicalAnalysis.value.implementationTimeline;
        const fsrMasterId = this.fsrMasterId;

        this.spinner = true;
        this.technicalAnalysisService.createTechnicalAnalysis(location, technicalDesign, outputPlan, costEstimates, impTimeline, this.file, fsrMasterId).subscribe(res => {
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

    //For create technical analysis
    saveAndExit() {
        const location = this.formTechnologicalAnalysis.value.location;
        const technicalDesign = this.formTechnologicalAnalysis.value.technicalDesign;
        const outputPlan = this.formTechnologicalAnalysis.value.outputPlan;
        const costEstimates = this.formTechnologicalAnalysis.value.costEstimates;
        const impTimeline = this.formTechnologicalAnalysis.value.implementationTimeline;
        const fsrMasterId = this.fsrMasterId;

        this.spinner = true;
        this.technicalAnalysisService.createTechnicalAnalysis(location, technicalDesign, outputPlan, costEstimates, impTimeline, this.file, fsrMasterId).subscribe(res => {
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

    //For get technical analysis
    getTechnicalAnalysisByPcUuid(): any {
        this.technicalAnalysisService.getTechnicalAnalysisByPcUuid(this.fsrMasterId).subscribe(res => {
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
                // this.downloadAttachment(this.attachUrl);
            }
        });
    }

    //For set technical analysis form value
    setValueFromTechnicalAnalysis(res: any) {
        if (res.attachment != null) {
            this.formTechnologicalAnalysis.patchValue({
                location: res.location,
                technicalDesign: res.technicalDesign,
                outputPlan: res.outputPlan,
                costEstimates: res.costEstimates,
                implementationTimeline: res.impTimeline,
                attachmentTechnologicalAnalysis: res.attachment.uuid
            });
        } else {
            this.formTechnologicalAnalysis.patchValue({
                location: res.location,
                technicalDesign: res.technicalDesign,
                outputPlan: res.outputPlan,
                costEstimates: res.costEstimates,
                implementationTimeline: res.impTimeline
            });
        }

    }

    //For update technical analysis
    updateAndNext() {
        const location = this.formTechnologicalAnalysis.value.location;
        const technicalDesign = this.formTechnologicalAnalysis.value.technicalDesign;
        const outputPlan = this.formTechnologicalAnalysis.value.outputPlan;
        const costEstimates = this.formTechnologicalAnalysis.value.costEstimates;
        const impTimeline = this.formTechnologicalAnalysis.value.implementationTimeline;
        const fsrMasterId = this.fsrMasterId;

        this.spinner = true;
        this.technicalAnalysisService.updateTechnicalAnalysis(location, technicalDesign, outputPlan, costEstimates, impTimeline, this.file, fsrMasterId).subscribe(res => {
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

    //For update technical analysis
    updateAndExit() {
        const location = this.formTechnologicalAnalysis.value.location;
        const technicalDesign = this.formTechnologicalAnalysis.value.technicalDesign;
        const outputPlan = this.formTechnologicalAnalysis.value.outputPlan;
        const costEstimates = this.formTechnologicalAnalysis.value.costEstimates;
        const impTimeline = this.formTechnologicalAnalysis.value.implementationTimeline;
        const fsrMasterId = this.fsrMasterId;

        this.spinner = true;
        this.technicalAnalysisService.updateTechnicalAnalysis(location, technicalDesign, outputPlan, costEstimates, impTimeline, this.file, fsrMasterId).subscribe(res => {
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

    //For download attachment
    download() {
        // const url = environment.ibcs.ppsFsBaseEndPoint;
        // window.open(url + this.attachUrl);
        this.fileUploadService.downloadAttachmentInFsService(this.attachUrl);
    }

    //For delete attachment
    delete(value: string) {
        this.formTechnologicalAnalysis.controls[value].setValue(null, {emitEvent: false});
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
            this.expLocation = true;
        }
        if (i === 2) {
            this.expTechnicalDesign = true;
        }
        if (i === 3) {
            this.expOutputPlan = true;
        }
        if (i === 4) {
            this.expCostEstimates = true;
        }
        if (i === 5) {
            this.expImplementationTimeline = true;
        }
    }

    /**
     * For Collapsing CK Editor
     * @param i
     */
    collapse(i: number): void {
        if (i === 1) {
            this.expLocation = false;
        }
        if (i === 2) {
            this.expTechnicalDesign = false;
        }
        if (i === 3) {
            this.expOutputPlan = false;
        }
        if (i === 4) {
            this.expCostEstimates = false;
        }
        if (i === 5) {
            this.expImplementationTimeline = false;
        }
    }

    //For go to previous tab
    back(): void {
        this.backPrevious.emit(true);
    }

}
