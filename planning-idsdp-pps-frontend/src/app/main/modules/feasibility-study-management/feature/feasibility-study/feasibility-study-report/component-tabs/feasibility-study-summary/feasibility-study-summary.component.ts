import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FuseTranslationLoaderService } from '../../../../../../../core/services/translation-loader.service';
import { locale as lngEnglish } from './i18n/en';
import { locale as lngBangla } from './i18n/bn';
import { ActivatedRoute, Router } from '@angular/router';
import { FsSummaryModel } from '../../../../../models/feasibility-study-summary.model';
import { FeasibilityStudySummaryService } from '../../../../../services/feasibility-study-summary.service';
import { SectorModel } from '../../../../../../configuration-management/models/sector.model';
import { SectorService } from '../../../../../../configuration-management/services/sector.service';
import { SubSectorModel } from '../../../../../../configuration-management/models/sub-sector.model';
import { SubSectorService } from '../../../../../../configuration-management/services/sub-sector.service';
import { SnackbarHelper } from '../../../../../../../core/helper/snackbar.helper';
import { ERROR, OK } from '../../../../../../../core/constants/message';
import { ProjectSummaryService } from '../../../../../../project-concept-management/services/project-summary.service';
import { ParipatraVersionService } from '../../../../../../configuration-management/services/paripatra-version.service';
import { FeasibilityProposalHelperService } from '../../../../../services/feasibility-proposal-helper.service';
import { ProjectLocationService } from '../../../../../services/project-location.service';
import { IntroductionService } from '../../../../../services/introduction.service';
import { MarketAnalysisService } from '../../../../../services/market-analysis.service';
import { TechnicalAnalysisService } from '../../../../../services/technical-analysis.service';
import { RiskAnalysisService } from '../../../../../services/risk-analysis.service';
import { CostBenefitAnalysisService } from '../../../../../services/cost-benefit-analysis.service';
import { OtherAnalysisService } from '../../../../../services/other-analysis.service';
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
import { CategoryEnvironmentService } from "../../../../../../configuration-management/services/category-environment.service";
import { CategoryEnvironmentModel } from "../../../../../../configuration-management/models/categoryEnvironmentModel.model";
import { LocationHelperService } from '../../../../../../../shared/services/location-helper.service';
import { DatePipe } from "@angular/common";
import {
    MIN_EDITOR_CONFIG,
    MEDIUM_EDITOR_CONFIG
} from '../../../../../../../core/constants/editor-config';
import { UtilsService } from 'app/main/core/services/utils.service';


@Component({
    selector: 'app-feasibility-study-summary',
    templateUrl: './feasibility-study-summary.component.html',
    styleUrls: ['./feasibility-study-summary.component.scss']
})
export class FeasibilityStudySummaryComponent implements OnInit {

    minEditorConfig: any = MIN_EDITOR_CONFIG;
    mediumEditorConfig: any = MEDIUM_EDITOR_CONFIG;

    @Output() nextStep = new EventEmitter<boolean>();
    @Output() backPreviousPage = new EventEmitter<boolean>();

    sectorList: SectorModel[] = new Array<SectorModel>();
    subSectorList: SubSectorModel[] = new Array<SubSectorModel>();

    categoryList: CategoryEnvironmentModel[] = new Array<CategoryEnvironmentModel>();

    model: FsSummaryModel = new FsSummaryModel();

    form: FormGroup;

    update: boolean;

    expCommencementMaxDate: Date;
    expCompletionMinDate: Date;

    projectConceptUuid: string;

    projectConceptId: number;

    paripatraVersionId: number;

    uuid: string;

    spinner: boolean;

    constructor(private fuseTranslationLoaderService: FuseTranslationLoaderService,
        private router: Router,
        public datepipe: DatePipe,
        private feasibilityStudySummaryService: FeasibilityStudySummaryService,
        private projectSummaryService: ProjectSummaryService,
        private paripatraVersionService: ParipatraVersionService,
        private feasibilityProposalHelperService: FeasibilityProposalHelperService,
        private projectLocationService: ProjectLocationService,
        private introductionService: IntroductionService,
        private marketAnalysisService: MarketAnalysisService,
        private technicalAnalysisService: TechnicalAnalysisService,
        private riskAnalysisService: RiskAnalysisService,
        private costBenefitAnalysisService: CostBenefitAnalysisService,
        private otherAnalysisService: OtherAnalysisService,
        private sectorService: SectorService,
        private subSectorService: SubSectorService,
        private categoryEnvironmentService: CategoryEnvironmentService,
        private snackBar: SnackbarHelper,
        private locationHelperService: LocationHelperService,
        private utilsService: UtilsService,
        private route: ActivatedRoute) {
        this.projectConceptUuid = this.route.snapshot.params['uuid'];
        this.fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

    //For form initial
    ngOnInit(): void {
        this.getSector();
        this.getCategoryEnvironment();
        // this.findSector(event);
        this.populateForm();
        this.getFsSummaryByPcUuid();
        this.getPCByUuid();
        this.getParipatraVersionId();
    }

    //For form population
    private populateForm(): void {
        this.form = new FormGroup({
            titleEnPC: new FormControl(''),
            titleBnPC: new FormControl(''),
            estimatedCostPC: new FormControl(''),
            gobPC: new FormControl(''),
            paPC: new FormControl(''),
            ownFundPC: new FormControl(''),
            othersPC: new FormControl(''),
            dateOfCommencementPC: new FormControl(''),
            dateOfCompletionPC: new FormControl(''),
            titleEn: new FormControl('', Validators.required),
            titleBn: new FormControl('', Validators.required),
            sponsoringMinistryOrDivision: new FormControl(''),
            implementingAgency: new FormControl(''),
            projectObjectives: new FormControl(''),
            estimatedProjectCost: new FormControl(''),
            sectorOrDivision: new FormControl(''),
            subSector: new FormControl(''),
            projectCategoryId: new FormControl(''),
            dateOfCommencement: new FormControl('', Validators.required),
            dateOfCompletion: new FormControl('', Validators.required),
        });
    }

    private getPCByUuid() {
        this.projectSummaryService.getByUuid(this.projectConceptUuid).subscribe(res => {
            console.log('get project concept ==== > ', res);
            this.projectConceptId = res.id;
            this.form.patchValue({
                titleEn: res.titleEn,
                titleBn: res.titleBn,
                titleEnPC: res.titleEn,
                titleBnPC: res.titleBn,
                sponsoringMinistryOrDivision: res.sponsoringMinistryName,
                implementingAgency: res.implementingAgencyName,
                estimatedCostPC: res.totalAmount.toFixed(2),
                gobPC: res.gobAmount.toFixed(2),
                paPC: res.paAmount.toFixed(2),
                ownFundPC: res.ownFundAmount.toFixed(2),
                othersPC: res.otherAmount.toFixed(2),
                dateOfCommencementPC: this.datepipe.transform(res.expCommencementDate, 'dd-MM-yyyy'),
                dateOfCompletionPC: this.datepipe.transform(res.expCompletionDate, 'dd-MM-yyyy'),
            });
        });
    }

    private getParipatraVersionId() {
        this.paripatraVersionService.getActiveSingleParipatraVersion().subscribe(res => {
            this.paripatraVersionId = res.id;
        })
    }

    //For create fs summary
    saveAndNext(): void {
        this.model.title_en = this.form.value.titleEn;
        this.model.title_bn = this.form.value.titleBn;
        this.model.sponsoring_ministry_id = this.form.value.sponsoringMinistryOrDivision;
        this.model.implementing_agency_id = this.form.value.implementingAgency;
        this.model.project_objectives = this.form.value.projectObjectives;
        this.model.estimated_proj_cost = this.form.value.estimatedProjectCost;
        this.model.sector_id = this.form.value.sectorOrDivision;
        this.model.sub_sector_id = this.form.value.subSector;
        this.model.project_category_id = this.form.value.projectCategoryId;
        this.model.date_of_commencement = this.form.value.dateOfCommencement;
        this.model.date_of_completion = this.form.value.dateOfCompletion;
        this.model.projectConceptMasterUuid = this.projectConceptUuid;
        this.model.projectConceptMasterId = this.projectConceptId;
        this.model.paripatraVersionId = this.paripatraVersionId;

        if (this.model.title_en && this.model.title_bn && this.model.date_of_commencement && this.model.date_of_completion) {
            this.spinner = true;
            this.feasibilityStudySummaryService.create(this.model).subscribe(res => {
                if (res.uuid) {
                    this.feasibilityProposalHelperService.feasibilityReportCreateId = res.id;
                    this.projectLocationService.feasibilitySummarySaveClickEvent();
                    this.introductionService.feasibilitySummarySaveClickEvent();
                    this.marketAnalysisService.feasibilitySummarySaveClickEvent();
                    this.technicalAnalysisService.feasibilitySummarySaveClickEvent();
                    this.riskAnalysisService.feasibilitySummarySaveClickEvent();
                    this.costBenefitAnalysisService.feasibilitySummarySaveClickEvent();
                    this.otherAnalysisService.feasibilitySummarySaveClickEvent();
                    this.snackBar.openSuccessSnackBar();
                    this.spinner = false;
                    this.nextStep.emit(true);
                }
            }, err => {
                this.spinner = false;
                this.snackBar.openErrorSnackBar();
            });
        } else {
            this.form.markAllAsTouched();
            this.snackBar.openWarnSnackBarWithMessage("You missed some required field, Please fill all the required field", "Ok");
        }

    }

    //For get Fs summary by pc uuid
    getFsSummaryByPcUuid(): any {
        this.feasibilityStudySummaryService.getFsSummaryByPcUuid(this.projectConceptUuid).subscribe(res => {
            if (res) {
                this.update = true;
                this.setValueFromFsSummery(res);
                this.getFindSector(res.sector_id);
                this.uuid = res.uuid;
            }
        });
    }

    // For set Fs summary form value
    setValueFromFsSummery(res: any) {
        this.form.patchValue({
            titleEn: res.title_en,
            titleBn: res.title_bn,
            sponsoringMinistryOrDivision: res.sponsoring_ministry_id,
            implementingAgency: res.implementing_agency_id,
            projectObjectives: res.project_objectives,
            estimatedProjectCost: res.estimated_proj_cost,
            sectorOrDivision: res.sector_id,
            subSector: res.sub_sector_id,
            projectCategoryId: res.project_category_id,
            dateOfCommencement: res.date_of_commencement,
            dateOfCompletion: res.date_of_completion
        });
    }

    //For create Fs summary
    saveAndExit(): void {
        this.model.title_en = this.form.value.titleEn;
        this.model.title_bn = this.form.value.titleBn;
        this.model.sponsoring_ministry_id = this.form.value.sponsoringMinistryOrDivision;
        this.model.implementing_agency_id = this.form.value.implementingAgency;
        this.model.project_objectives = this.form.value.projectObjectives;
        this.model.estimated_proj_cost = this.form.value.estimatedProjectCost;
        this.model.sector_id = this.form.value.sectorOrDivision;
        this.model.sub_sector_id = this.form.value.subSector;
        this.model.project_category_id = this.form.value.projectCategoryId;
        this.model.date_of_commencement = this.form.value.dateOfCommencement;
        this.model.date_of_completion = this.form.value.dateOfCompletion;
        this.model.projectConceptMasterUuid = this.projectConceptUuid;
        this.model.projectConceptMasterId = this.projectConceptId;
        this.model.paripatraVersionId = this.paripatraVersionId;

        if (this.model.title_en && this.model.title_bn && this.model.date_of_commencement && this.model.date_of_completion) {
            this.spinner = true;
            this.feasibilityStudySummaryService.create(this.model).subscribe(res => {
                if (res.uuid) {
                    this.snackBar.openSuccessSnackBar();
                    this.feasibilityProposalHelperService.feasibilityReportCreateId = res.id;
                    this.projectLocationService.feasibilitySummarySaveClickEvent();
                    this.introductionService.feasibilitySummarySaveClickEvent();
                    this.marketAnalysisService.feasibilitySummarySaveClickEvent();
                    this.technicalAnalysisService.feasibilitySummarySaveClickEvent();
                    this.riskAnalysisService.feasibilitySummarySaveClickEvent();
                    this.costBenefitAnalysisService.feasibilitySummarySaveClickEvent();
                    this.otherAnalysisService.feasibilitySummarySaveClickEvent();
                    this.spinner = false;
                    this.router.navigate([`feasibility-study`]);
                    // this.router.navigate(['feasibility-study/view-dashboard/' + this.route.snapshot.paramMap.get('uuid')]);
                }
            }, err => {
                this.spinner = false;
                this.snackBar.openErrorSnackBar();
            });
        } else {
            this.form.markAllAsTouched();
            this.snackBar.openWarnSnackBarWithMessage("You missed some required field, Please fill all the required field", "Ok");
        }

    }

    //For update Fs summary
    updateAndNext(): void {

        this.model.title_en = this.form.value.titleEn;
        this.model.title_bn = this.form.value.titleBn;
        this.model.sponsoring_ministry_id = this.form.value.sponsoringMinistryOrDivision;
        this.model.implementing_agency_id = this.form.value.implementingAgency;
        this.model.project_objectives = this.form.value.projectObjectives;
        this.model.estimated_proj_cost = this.form.value.estimatedProjectCost;
        this.model.sector_id = this.form.value.sectorOrDivision;
        this.model.sub_sector_id = this.form.value.subSector;
        this.model.project_category_id = this.form.value.projectCategoryId;
        this.model.date_of_commencement = this.form.value.dateOfCommencement;
        this.model.date_of_completion = this.form.value.dateOfCompletion;
        this.model.projectConceptMasterUuid = this.projectConceptUuid;
        this.model.projectConceptMasterId = this.projectConceptId;
        this.model.paripatraVersionId = this.paripatraVersionId;
        this.model.uuid = this.uuid;

        if (this.model.title_en && this.model.title_bn && this.model.date_of_commencement && this.model.date_of_completion) {
            this.spinner = true;
            this.feasibilityStudySummaryService.update(this.model).subscribe(res => {
                if (res.uuid) {
                    // this.snackBar.openSuccessSnackBar();
                    this.feasibilityProposalHelperService.feasibilityReportCreateId = res.id;
                    this.projectLocationService.feasibilitySummarySaveClickEvent();
                    this.locationHelperService.setProjectLocationEvent();
                    this.introductionService.feasibilitySummarySaveClickEvent();
                    this.marketAnalysisService.feasibilitySummarySaveClickEvent();
                    this.technicalAnalysisService.feasibilitySummarySaveClickEvent();
                    this.riskAnalysisService.feasibilitySummarySaveClickEvent();
                    this.costBenefitAnalysisService.feasibilitySummarySaveClickEvent();
                    this.otherAnalysisService.feasibilitySummarySaveClickEvent();
                    this.snackBar.openSuccessSnackBarWithMessage('Successfully Update Data', OK);
                    this.spinner = false;
                    this.nextStep.emit(true);
                }
            }, err => {
                // this.snackBar.openErrorSnackBar();
                this.spinner = false;
                this.snackBar.openErrorSnackBarWithMessage('Failed to update data', ERROR);
            });
        }
    }

    //For update Fs summary
    updateAndExit(): void {

        this.model.title_en = this.form.value.titleEn;
        this.model.title_bn = this.form.value.titleBn;
        this.model.sponsoring_ministry_id = this.form.value.sponsoringMinistryOrDivision;
        this.model.implementing_agency_id = this.form.value.implementingAgency;
        this.model.project_objectives = this.form.value.projectObjectives;
        this.model.estimated_proj_cost = this.form.value.estimatedProjectCost;
        this.model.sector_id = this.form.value.sectorOrDivision;
        this.model.sub_sector_id = this.form.value.subSector;
        this.model.project_category_id = this.form.value.projectCategoryId;
        this.model.date_of_commencement = this.form.value.dateOfCommencement;
        this.model.date_of_completion = this.form.value.dateOfCompletion;
        this.model.projectConceptMasterUuid = this.projectConceptUuid;
        this.model.projectConceptMasterId = this.projectConceptId;
        this.model.paripatraVersionId = this.paripatraVersionId;
        this.model.uuid = this.uuid;

        if (this.model.title_en && this.model.title_bn && this.model.date_of_commencement && this.model.date_of_completion) {
            this.spinner = true;
            this.feasibilityStudySummaryService.update(this.model).subscribe(res => {
                if (res.uuid) {
                    // this.snackBar.openSuccessSnackBar();
                    this.feasibilityProposalHelperService.feasibilityReportCreateId = res.id;
                    this.projectLocationService.feasibilitySummarySaveClickEvent();
                    this.locationHelperService.setProjectLocationEvent();
                    this.introductionService.feasibilitySummarySaveClickEvent();
                    this.marketAnalysisService.feasibilitySummarySaveClickEvent();
                    this.technicalAnalysisService.feasibilitySummarySaveClickEvent();
                    this.riskAnalysisService.feasibilitySummarySaveClickEvent();
                    this.costBenefitAnalysisService.feasibilitySummarySaveClickEvent();
                    this.otherAnalysisService.feasibilitySummarySaveClickEvent();
                    this.snackBar.openSuccessSnackBarWithMessage('Successfully Update Data', OK);
                    this.spinner = false;
                    this.router.navigate([`feasibility-study`]);
                    // this.router.navigate(['feasibility-study/view-dashboard/' + this.route.snapshot.paramMap.get('uuid')]);
                }
            }, err => {
                // this.snackBar.openErrorSnackBar();
                this.spinner = false;
                this.snackBar.openErrorSnackBarWithMessage('Failed to update data', ERROR);
            });
        }
    }

    //For get sector
    getSector() {
        this.sectorList = [];
        this.sectorService.getActiveSector().subscribe(res => {
            res.forEach(m => {
                this.sectorList.push(m);

            });
        });
    }

    //For get Category
    getCategoryEnvironment() {
        this.categoryList = [];
        this.categoryEnvironmentService.getAllActiveCategoryEnvironmentList().subscribe(res => {
            res.forEach(m => {
                this.categoryList.push(m);
            });
        });
    }

    //For get subsector
    findSector(event): any {
        const sectorId = event.value;
        this.getFindSector(sectorId);
    }

    //For get sub sector
    getFindSector(sectorId: any) {
        this.subSectorList = [];
        this.subSectorService.getBySectorId(sectorId).subscribe(res => {
            res.forEach(m => {
                this.subSectorList.push(m);
            });
        });
    }

    // set Commencement Max Date
    completionDataChange($event: MatDatepickerInputEvent<Date>) {
        const value = new Date($event.value);
        this.expCommencementMaxDate = value;
    }

    // set Completion Min Date

    commencementDataChange($event: MatDatepickerInputEvent<Date>) {
        const value = new Date($event.value);
        this.expCompletionMinDate = value;
    }

    go(): void {
        // this.router.navigate(['https://ibcsprimaxsoftwa.maps.arcgis.com/apps/webappviewer/index.html?id=cff398820d5a42a38e35057d09fc3d8a']);
    }

    nextTab(): void {
        this.nextStep.emit(true);
    }

    /*
    Back previous page
     */

    backPrevious() {
        this.backPreviousPage.emit(true);
    }

    uploadImageAsBase64(files: any, propertyName: string) {
        this.utilsService.uploadImageAsBase64(this.form, files, propertyName);
    }
}
