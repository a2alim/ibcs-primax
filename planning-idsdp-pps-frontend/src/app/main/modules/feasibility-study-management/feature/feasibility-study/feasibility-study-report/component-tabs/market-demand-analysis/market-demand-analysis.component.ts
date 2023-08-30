import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FuseTranslationLoaderService} from '../../../../../../../core/services/translation-loader.service';
import {locale as lngEnglish} from './i18n/en';
import {locale as lngBangla} from './i18n/bn';
import {FormControl, FormGroup} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MarketAnalysisService} from '../../../../../services/market-analysis.service';
import {MarketAnalysisModel} from '../../../../../models/MarketAnalysis.model';
import {SnackbarHelper} from '../../../../../../../core/helper/snackbar.helper';
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
    selector: 'app-market-demand-analysis',
    templateUrl: './market-demand-analysis.component.html',
    styleUrls: ['./market-demand-analysis.component.scss']
})
export class MarketDemandAnalysisComponent implements OnInit {

    minEditorConfig: any = MIN_EDITOR_CONFIG;
    mediumEditorConfig: any = MEDIUM_EDITOR_CONFIG;

    clickEventSubscription: Subscription;

    @Output() nextStep = new EventEmitter<boolean>();
    @Output() backPrevious = new EventEmitter<boolean>();

    form: FormGroup;

    model: MarketAnalysisModel = new MarketAnalysisModel();

    file: File;

    update: boolean;

    downloadEnable: boolean = false;

    fsrMasterId: number;

    expProblemStatement: boolean = true;
    expRelevanceOfTheProjectIdea: boolean = true;
    expProposedProjectInterventions: boolean = true;
    expStakeholders: boolean = true;
    expCurrentDemand: boolean = true;
    expFutureDemand: boolean = true;
    expVariousDemand: boolean = true;
    expSWOTAnalysis: boolean = true;

    uuid: string;
    attachUrl: string;

    attachmentName: string;
    isAttachmentNameEnable: boolean;

    spinner: boolean;

    constructor(private fuseTranslationLoaderService: FuseTranslationLoaderService,
                private marketAnalysisService: MarketAnalysisService,
                private feasibilityProposalHelperService: FeasibilityProposalHelperService,
                private route: ActivatedRoute,
                private fileUploadService: FileUploadService,
                private router: Router,
                private fsService: FeasibilityStudySummaryService,
                private utilsService: UtilsService,
                private snackBar: SnackbarHelper) {
        this.clickEventSubscription = this.marketAnalysisService.getFeasibilitySummarySaveEvent().subscribe(() => {
            this.loadData();
        });
        this.fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

    //For form initial
    ngOnInit(): void {
        this.populateForm();
        this.getFSByPcUuid();
    }

    loadData(): void {
        this.fsrMasterId = this.feasibilityProposalHelperService.feasibilityReportCreateId;
        this.getMarketAnalysisByPcUuid();

    }

    private getFSByPcUuid() {
        this.spinner = true;
        this.fsService.getFsSummaryByPcUuid(this.route.snapshot.paramMap.get('uuid')).subscribe(res => {
            if (res) {
                this.fsrMasterId = res.id;
                this.getMarketAnalysisByPcUuid();
            }
            this.spinner = false;
        });
    }


    private populateForm(): void {
        this.form = new FormGroup({
            problemStatement: new FormControl(''),
            relevanceOfTheProjectIdea: new FormControl(''),
            proposedProjectInterventions: new FormControl(''),
            stakeholders: new FormControl(''),
            currentDemand: new FormControl(''),
            futureDemand: new FormControl(''),
            variousDemand: new FormControl(''),
            sWOTAnalysis: new FormControl(''),
            attachment: new FormControl(''),
        });
    }


    uploadImageAsBase64(files: any, propertyName: string) {
        this.utilsService.uploadImageAsBase64(this.form, files, propertyName);
    }

    //For attachment
    selectedFile(file: FileList): any {
        this.file = file.item(0);
        this.isAttachmentNameEnable = false;
        this.attachmentName = "";
    }

    //For create market analysis
    saveAndNext(): void {
        const prbStatement = this.form.value.problemStatement;
        const relevanceProjectIdea = this.form.value.relevanceOfTheProjectIdea;
        const proposedProjectInterventions = this.form.value.proposedProjectInterventions;
        const stakeholders = this.form.value.stakeholders;
        const currentDemand = this.form.value.currentDemand;
        const futureDemand = this.form.value.futureDemand;
        const variousDemand = this.form.value.variousDemand;
        const swotAnalysis = this.form.value.sWOTAnalysis;
        const fsrMasterId = this.fsrMasterId;
        this.spinner = true;
        // tslint:disable-next-line:max-line-length
        this.marketAnalysisService.createMarketAnalysis(prbStatement, relevanceProjectIdea, proposedProjectInterventions, stakeholders, currentDemand, futureDemand, variousDemand, swotAnalysis, this.file, fsrMasterId).subscribe(res => {
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

    //For create market analysis
    saveAndExit(): void {
        const prbStatement = this.form.value.problemStatement;
        const relevanceProjectIdea = this.form.value.relevanceOfTheProjectIdea;
        const proposedProjectInterventions = this.form.value.proposedProjectInterventions;
        const stakeholders = this.form.value.stakeholders;
        const currentDemand = this.form.value.currentDemand;
        const futureDemand = this.form.value.futureDemand;
        const variousDemand = this.form.value.variousDemand;
        const swotAnalysis = this.form.value.sWOTAnalysis;
        const fsrMasterId = this.fsrMasterId;
        this.spinner = true;
        // tslint:disable-next-line:max-line-length
        this.marketAnalysisService.createMarketAnalysis(prbStatement, relevanceProjectIdea, proposedProjectInterventions, stakeholders, currentDemand, futureDemand, variousDemand, swotAnalysis, this.file, fsrMasterId).subscribe(res => {
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

    //For get market analysis
    getMarketAnalysisByPcUuid(): any {
        this.marketAnalysisService.getMarketAnalysisByPcUuid(this.fsrMasterId).subscribe(res => {
            if (res) {
                this.update = true;
                this.setValueFromMarketAnalysis(res);
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

    //For set market analysis form value
    setValueFromMarketAnalysis(res: any) {
        if (res.attachment != null) {
            this.form.patchValue({
                problemStatement: res.prbStatement,
                relevanceOfTheProjectIdea: res.relevanceProjectIdea,
                proposedProjectInterventions: res.proposedProjectInterventions,
                stakeholders: res.stakeholders,
                currentDemand: res.currentDemand,
                futureDemand: res.futureDemand,
                variousDemand: res.variousDemand,
                sWOTAnalysis: res.swotAnalysis,
                attachment: res.attachment.uuid,
            });
        } else {
            this.form.patchValue({
                problemStatement: res.prbStatement,
                relevanceOfTheProjectIdea: res.relevanceProjectIdea,
                proposedProjectInterventions: res.proposedProjectInterventions,
                stakeholders: res.stakeholders,
                currentDemand: res.currentDemand,
                futureDemand: res.futureDemand,
                variousDemand: res.variousDemand,
                sWOTAnalysis: res.swotAnalysis
            });
        }
    }

    //For download attachment
    download() {
        // const url = environment.ibcs.ppsFsBaseEndPoint;
        // window.open(url + this.attachUrl);
        this.fileUploadService.downloadAttachmentInFsService(this.attachUrl);
    }

    //For update market analysis
    updateAndNext() {
        const prbStatement = this.form.value.problemStatement;
        const relevanceProjectIdea = this.form.value.relevanceOfTheProjectIdea;
        const proposedProjectInterventions = this.form.value.proposedProjectInterventions;
        const stakeholders = this.form.value.stakeholders;
        const currentDemand = this.form.value.currentDemand;
        const futureDemand = this.form.value.futureDemand;
        const variousDemand = this.form.value.variousDemand;
        const swotAnalysis = this.form.value.sWOTAnalysis;
        const fsrMasterId = this.fsrMasterId;
        this.spinner = true;
        // tslint:disable-next-line:max-line-length
        this.marketAnalysisService.updateMarketAnalysis(prbStatement, relevanceProjectIdea, proposedProjectInterventions, stakeholders, currentDemand, futureDemand, variousDemand, swotAnalysis, this.file, fsrMasterId).subscribe(res => {
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

    //For update market analysis
    updateAndExit() {
        const prbStatement = this.form.value.problemStatement;
        const relevanceProjectIdea = this.form.value.relevanceOfTheProjectIdea;
        const proposedProjectInterventions = this.form.value.proposedProjectInterventions;
        const stakeholders = this.form.value.stakeholders;
        const currentDemand = this.form.value.currentDemand;
        const futureDemand = this.form.value.futureDemand;
        const variousDemand = this.form.value.variousDemand;
        const swotAnalysis = this.form.value.sWOTAnalysis;
        const fsrMasterId = this.fsrMasterId;
        this.spinner = true;
        // tslint:disable-next-line:max-line-length
        this.marketAnalysisService.updateMarketAnalysis(prbStatement, relevanceProjectIdea, proposedProjectInterventions, stakeholders, currentDemand, futureDemand, variousDemand, swotAnalysis, this.file, fsrMasterId).subscribe(res => {
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


    //For delete attachment
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
            this.expProblemStatement = true;
        }
        if (i === 2) {
            this.expRelevanceOfTheProjectIdea = true;
        }
        if (i === 3) {
            this.expProposedProjectInterventions = true;
        }
        if (i === 4) {
            this.expStakeholders = true;
        }
        if (i === 5) {
            this.expCurrentDemand = true;
        }
        if (i === 6) {
            this.expFutureDemand = true;
        }
        if (i === 7) {
            this.expVariousDemand = true;
        }
        if (i === 8) {
            this.expSWOTAnalysis = true;
        }
    }

    /**
     * For Collapsing CK Editor
     * @param i
     */
    collapse(i: number): void {
        if (i === 1) {
            this.expProblemStatement = false;
        }
        if (i === 2) {
            this.expRelevanceOfTheProjectIdea = false;
        }
        if (i === 3) {
            this.expProposedProjectInterventions = false;
        }
        if (i === 4) {
            this.expStakeholders = false;
        }
        if (i === 5) {
            this.expCurrentDemand = false;
        }
        if (i === 6) {
            this.expFutureDemand = false;
        }
        if (i === 7) {
            this.expVariousDemand = false;
        }
        if (i === 8) {
            this.expSWOTAnalysis = false;
        }
    }

    //For go to previous tab
    back(): void {
        this.backPrevious.emit(true);
    }
}
