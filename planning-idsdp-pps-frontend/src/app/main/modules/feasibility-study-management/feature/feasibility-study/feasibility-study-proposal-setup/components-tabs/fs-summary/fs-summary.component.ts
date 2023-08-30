import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FuseTranslationLoaderService } from '../../../../../../../core/services/translation-loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { locale as lngEnglish } from './i18n/en';
import { locale as lngBangla } from './i18n/bn';
import { ProjectSummaryService } from '../../../../../../project-concept-management/services/project-summary.service';
import { SnackbarHelper } from '../../../../../../../core/helper/snackbar.helper';
import { FeasibilityStudyProposalSummaryModel } from '../../../../../models/feasibility-study-proposal-summary.model';
import { FeasibilityStudyProposalSummaryService } from '../../../../../services/feasibility-study-proposal-summary.service';
import { FeasibilityProposalHelperService } from '../../../../../services/feasibility-proposal-helper.service';
import { ERROR, OK } from '../../../../../../../core/constants/message';
import { ExpenditureCostService } from '../../../../../services/expenditure-cost.service';
import { ModeOfFinanceService } from '../../../../../services/mode-of-finance.service';
import { ParipatraVersionService } from '../../../../../../configuration-management/services/paripatra-version.service';
import { VisitPlanService } from '../../../../../services/visit-plan.service';
import { WorkPlanService } from '../../../../../services/work-plan.service';
import { VendorManagementService } from '../../../../../services/vendor-management.service';
import { CommitteeService } from '../../../../../services/committee.service';
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
import { DatePipe } from "@angular/common";
import {
    MIN_EDITOR_CONFIG,
    MEDIUM_EDITOR_CONFIG
} from '../../../../../../../core/constants/editor-config';
import { UtilsService } from 'app/main/core/services/utils.service';
import {UserGroupService} from "../../../../../../configuration-management/services/user-group.service";

@Component({
    selector: 'app-fs-summary',
    templateUrl: './fs-summary.component.html',
    styleUrls: ['./fs-summary.component.scss']
})
export class FsSummaryComponent implements OnInit {

    minEditorConfig: any = MIN_EDITOR_CONFIG;
    mediumEditorConfig: any = MEDIUM_EDITOR_CONFIG;

    @Output() nextStep = new EventEmitter<boolean>();

    projectConceptUuid: string;

    projectConceptId: number;

    paripatraVersionId: number;

    expCommencementMaxDate: Date;
    expCompletionMinDate: Date;

    formSummary: FormGroup;
    formDescription: any;
    formEstimatedCost: FormGroup;
    formImplementingModality: FormGroup;

    expBackground: boolean = true;
    expObjective: boolean = true;
    expBriefOutlineScope: boolean = true;
    expOutput: boolean = true;
    expNeedJustification: boolean = true;
    expMethodology: boolean = true;
    expFinancing: boolean = true;
    listOfMachinery: boolean = true;

    id: number;

    model: FeasibilityStudyProposalSummaryModel = new FeasibilityStudyProposalSummaryModel();

    isSelfFund: boolean;
    isForeignAid: boolean;

    update: boolean;
    uuid: string;

    saveBtnDisable: boolean;

    userId : any;
    ministry_name: string;
    agency_name : string;

    spinner: boolean;


    constructor(private fuseTranslationLoaderService: FuseTranslationLoaderService,
        private router: Router,
        public datepipe: DatePipe,
        private projectSummaryService: ProjectSummaryService,
        private feasibilityProposalHelperService: FeasibilityProposalHelperService,
        private feasibilityStudyProposalSummaryService: FeasibilityStudyProposalSummaryService,
        private snackBar: SnackbarHelper,
        private paripatraVersionService: ParipatraVersionService,
        private expenditureCostService: ExpenditureCostService,
        private modeOfFinanceService: ModeOfFinanceService,
        private visitPlanService: VisitPlanService,
        private workPlanService: WorkPlanService,
        private vendorManagementService: VendorManagementService,
        private committeeService: CommitteeService,
        private utilsService: UtilsService,
        private route: ActivatedRoute,
        private userGroupService: UserGroupService) {
        this.projectConceptUuid = this.route.snapshot.params['uuid'];
        this.fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);

    }

    ngOnInit(): void {
        this.initForm();
        this.getPCByUuid();
        this.getFspSummaryByPcUuid();
        if (!this.update) {
            this.getParipatraVersionId();
        }
        this.getUserGroup();
    }

    getUserGroup() {
        this.userGroupService.getUserGroup().subscribe(res => {
            this.userId = res.res.userId;
            this.getUserInfoByUserId(this.userId);
        })
    }
    getUserInfoByUserId(userId) {
        this.userGroupService.geUserInfoByUserId(userId).subscribe(res => {
            this.agency_name = res.agency.nameEn;
            this.ministry_name = res.agency.ministryDivision.nameEn;
        })
    }

    //form initialization
    private initForm(): void {
        this.formSummary = new FormGroup({
            titleEnPC: new FormControl(''),
            titleBnPC: new FormControl(''),
            estimatedCostPC: new FormControl(''),
            gobPC: new FormControl(''),
            paPC: new FormControl(''),
            ownFundPC: new FormControl(''),
            othersPC: new FormControl(''),
            dateOfCommencementPC: new FormControl(''),
            dateOfCompletionPC: new FormControl(''),
            enTitle: new FormControl('', Validators.required),
            bnTitle: new FormControl('', Validators.required),
            // sponsoringMinistry: new FormControl({ value: ''}),
            // executingAgency: new FormControl({ value: ''}),
            sponsoringMinistry: new FormControl(''),
            executingAgency: new FormControl(''),
            dateCommencement: new FormControl('', Validators.required),
            dateCompletion: new FormControl('', Validators.required)
        });
        this.formDescription = new FormGroup({
            background: new FormControl('', Validators.required),
            objective: new FormControl('', Validators.required),
            briefOutlineScope: new FormControl('', Validators.required),
            output: new FormControl('', Validators.required),
            needJustification: new FormControl('', Validators.required)
        });
        this.formEstimatedCost = new FormGroup({
            total: new FormControl(0, [Validators.required, Validators.min(0)]),
            gob: new FormControl(0, [Validators.required, Validators.min(0)]),
            gobFe: new FormControl(0, [Validators.required, Validators.min(0)]),
            ownFund: new FormControl(0, [Validators.required, Validators.min(0)]),
            ownFundFe: new FormControl(0, [Validators.required, Validators.min(0)]),
            pa: new FormControl(0, [Validators.required, Validators.min(0)]),
            rpa: new FormControl(0, [Validators.required, Validators.min(0)]),
            dpa: new FormControl(0, [Validators.required, Validators.min(0)]),
            other: new FormControl(0, [Validators.required, Validators.min(0)]),
            feOther: new FormControl(0, [Validators.required, Validators.min(0)])
        });
        this.formImplementingModality = new FormGroup({
            methodology: new FormControl('', Validators.required),
            financing: new FormControl('', Validators.required),
            listOfMachinery: new FormControl('')
        });
    }

    private getPCByUuid() {
        this.projectSummaryService.getByUuid(this.projectConceptUuid).subscribe(res => {
            this.projectConceptId = res.id;
            this.isSelfFund = res.isSelfFund;
            this.isForeignAid = res.isForeignAid;
            this.formSummary.patchValue({
                enTitle: res.titleEn,
                bnTitle: res.titleBn,
                titleEnPC: res.titleEn,
                titleBnPC: res.titleBn,
                estimatedCostPC: res.totalAmount.toFixed(2),
                gobPC: res.gobAmount.toFixed(2),
                paPC: res.paAmount.toFixed(2),
                ownFundPC: res.ownFundAmount.toFixed(2),
                othersPC: res.otherAmount.toFixed(2),
                dateOfCommencementPC: this.datepipe.transform(res.expCommencementDate, 'dd-MM-yyyy'),
                dateOfCompletionPC: this.datepipe.transform(res.expCompletionDate, 'dd-MM-yyyy')
            });
        });
    }

    private getParipatraVersionId() {
        this.paripatraVersionService.getActiveSingleParipatraVersion().subscribe(res => {
            this.paripatraVersionId = res.id;
        })
    }

    uploadImageAsBase64(files: any, propertyName: string) {
        this.utilsService.uploadImageAsBase64(this.formDescription, files, propertyName);
    }

    // fs proposal summary create function
    saveAndNext() {
        this.model.titleEn = this.formSummary.value.enTitle;
        this.model.titleBn = this.formSummary.value.bnTitle;
        this.model.sponsoringMinistry = this.ministry_name;
        this.model.executingAgency = this.agency_name;
        this.model.dateOfCommencement = this.formSummary.value.dateCommencement;
        this.model.dateOfCompletion = this.formSummary.value.dateCompletion;
        this.model.background = this.formDescription.value.background;
        this.model.objective = this.formDescription.value.objective;
        this.model.briefOutlineScope = this.formDescription.value.briefOutlineScope;
        this.model.output = this.formDescription.value.output;
        this.model.needJustification = this.formDescription.value.needJustification;
        this.model.totalAmount = this.formEstimatedCost.value.total;
        this.model.gobAmount = this.formEstimatedCost.value.gob;
        this.model.feGobAmount = this.formEstimatedCost.value.gobFe;
        this.model.ownFundAmount = this.formEstimatedCost.value.ownFund;
        this.model.feOwnFundAmount = this.formEstimatedCost.value.ownFundFe;
        this.model.paAmount = this.formEstimatedCost.value.pa;
        this.model.rpaAmount = this.formEstimatedCost.value.rpa;
        this.model.dpaAmount = this.formEstimatedCost.value.dpa;
        this.model.otherAmount = this.formEstimatedCost.value.other;
        this.model.feOtherAmount = this.formEstimatedCost.value.feOther;
        this.model.methodologyOfConductingStudy = this.formImplementingModality.value.methodology;
        this.model.financingArrangement = this.formImplementingModality.value.financing;
        this.model.listOfMachinery = this.formImplementingModality.value.listOfMachinery;
        this.model.projectConceptMasterUuid = this.projectConceptUuid;
        this.model.projectConceptMasterId = this.projectConceptId;
        this.model.paripatraVersionId = this.paripatraVersionId;

        if (this.formSummary.valid && this.formDescription.valid && this.formEstimatedCost.valid && this.formImplementingModality.valid) {
            this.spinner = true;
            this.feasibilityStudyProposalSummaryService.create(this.model).subscribe(res => {
                if (res.uuid) {
                    this.feasibilityProposalHelperService.feasibilityProposalCreateId = res.id;
                    this.feasibilityProposalHelperService.feasibilityUpdate = false;
                    // this.formSummary.reset();
                    // this.formDescription.reset();
                    // this.formEstimatedCost.reset();
                    // this.formImplementingModality.reset();
                    this.expenditureCostService.feasibilitySummarySaveClickEvent();
                    this.modeOfFinanceService.feasibilitySummarySaveClickEvent();
                    this.visitPlanService.feasibilitySummarySaveClickEvent();
                    this.workPlanService.feasibilitySummarySaveClickEvent();
                    this.vendorManagementService.feasibilitySummarySaveClickEvent();
                    this.committeeService.feasibilitySummarySaveClickEvent();
                    this.spinner = false;
                    this.snackBar.openSuccessSnackBar();
                    this.nextStep.emit(true);
                }
            }, err => {
                this.spinner = false;
                this.snackBar.openErrorSnackBar();
            });
        } else {
            this.formSummary.markAllAsTouched();
            this.formDescription.markAllAsTouched();
            this.formEstimatedCost.markAllAsTouched();
            this.formImplementingModality.markAllAsTouched();
            this.snackBar.openWarnSnackBarWithMessage("You missed some required field, Please fill all the required field", "Ok");
        }

    }

    // fs proposal summary create function
    saveAndExit() {
        this.model.titleEn = this.formSummary.value.enTitle;
        this.model.titleBn = this.formSummary.value.bnTitle;
        this.model.sponsoringMinistry = this.ministry_name;
        this.model.executingAgency = this.agency_name;
        this.model.dateOfCommencement = this.formSummary.value.dateCommencement;
        this.model.dateOfCompletion = this.formSummary.value.dateCompletion;
        this.model.background = this.formDescription.value.background;
        this.model.objective = this.formDescription.value.objective;
        this.model.briefOutlineScope = this.formDescription.value.briefOutlineScope;
        this.model.output = this.formDescription.value.output;
        this.model.needJustification = this.formDescription.value.needJustification;
        this.model.totalAmount = this.formEstimatedCost.value.total;
        this.model.gobAmount = this.formEstimatedCost.value.gob;
        this.model.feGobAmount = this.formEstimatedCost.value.gobFe;
        this.model.ownFundAmount = this.formEstimatedCost.value.ownFund;
        this.model.feOwnFundAmount = this.formEstimatedCost.value.ownFundFe;
        this.model.paAmount = this.formEstimatedCost.value.pa;
        this.model.rpaAmount = this.formEstimatedCost.value.rpa;
        this.model.dpaAmount = this.formEstimatedCost.value.dpa;
        this.model.otherAmount = this.formEstimatedCost.value.other;
        this.model.feOtherAmount = this.formEstimatedCost.value.feOther;
        this.model.methodologyOfConductingStudy = this.formImplementingModality.value.methodology;
        this.model.financingArrangement = this.formImplementingModality.value.financing;
        this.model.listOfMachinery = this.formImplementingModality.value.listOfMachinery;
        this.model.projectConceptMasterUuid = this.projectConceptUuid;
        this.model.projectConceptMasterId = this.projectConceptId;

        if (this.formSummary.valid && this.formDescription.valid && this.formEstimatedCost.valid && this.formImplementingModality.valid) {
            this.spinner = true;
            this.feasibilityStudyProposalSummaryService.create(this.model).subscribe(res => {
                if (res.uuid) {
                    this.feasibilityProposalHelperService.feasibilityProposalCreateId = res.id;
                    // this.formSummary.reset();
                    // this.formDescription.reset();
                    // this.formEstimatedCost.reset();
                    // this.formImplementingModality.reset();
                    this.snackBar.openSuccessSnackBar();
                    this.spinner = false;
                    this.router.navigate(['feasibility-study/edit-dashboard/' + this.route.snapshot.paramMap.get('uuid')]);
                }
            }, err => {
                this.spinner = false;
                this.snackBar.openErrorSnackBar();
            });
        } else {
            this.formSummary.markAllAsTouched();
            this.formDescription.markAllAsTouched();
            this.formEstimatedCost.markAllAsTouched();
            this.formImplementingModality.markAllAsTouched();
            this.snackBar.openWarnSnackBarWithMessage("You missed some required field, Please fill all the required field", "Ok");
        }

    }

    // fs proposal summary get function by project concept uuid
    getFspSummaryByPcUuid(): any {
        this.feasibilityStudyProposalSummaryService.getFspSummaryByPcUuid(this.projectConceptUuid).subscribe(res => {
            if (res) {
                this.update = true;
                this.saveBtnDisable = true;
                this.setValueFromFspSummery(res);
                this.uuid = res.uuid;
                this.feasibilityProposalHelperService.feasibilityProposalCreateId = res.id;
                this.expenditureCostService.feasibilitySummarySaveClickEvent();
                this.modeOfFinanceService.feasibilitySummarySaveClickEvent();
                this.visitPlanService.feasibilitySummarySaveClickEvent();
                this.workPlanService.feasibilitySummarySaveClickEvent();
                this.vendorManagementService.feasibilitySummarySaveClickEvent();
                this.committeeService.feasibilitySummarySaveClickEvent();
            }
        });

    }

    // fs proposal summary form set value in edit mode after getting data by project concept uuid
    setValueFromFspSummery(res: any) {
        this.formSummary.patchValue({
            enTitle: res.titleEn,
            bnTitle: res.titleBn,
            sponsoringMinistry: res.sponsoringMinistry,
            executingAgency: res.executingAgency,
            dateCommencement: res.dateOfCommencement,
            dateCompletion: res.dateOfCompletion
        });
        this.formDescription.patchValue({
            background: res.background,
            objective: res.objective,
            briefOutlineScope: res.briefOutlineScope,
            output: res.output,
            needJustification: res.needJustification
        });
        this.formEstimatedCost.patchValue({
            total: res.totalAmount,
            gob: res.gobAmount,
            gobFe: res.feGobAmount,
            ownFund: res.ownFundAmount,
            ownFundFe: res.feOwnFundAmount,
            pa: res.paAmount,
            rpa: res.rpaAmount,
            dpa: res.dpaAmount,
            other: res.otherAmount,
            feOther: res.feOtherAmount
        });
        this.formImplementingModality.patchValue({
            methodology: res.methodologyOfConductingStudy,
            financing: res.financingArrangement,
            listOfMachinery: res.listOfMachinery
        });
    }

    // fs proposal summary update function
    updateAndNext() {
        this.model.titleEn = this.formSummary.value.enTitle;
        this.model.titleBn = this.formSummary.value.bnTitle;
        this.model.sponsoringMinistry = this.ministry_name;
        this.model.executingAgency = this.agency_name;
        this.model.dateOfCommencement = this.formSummary.value.dateCommencement;
        this.model.dateOfCompletion = this.formSummary.value.dateCompletion;
        this.model.background = this.formDescription.value.background;
        this.model.objective = this.formDescription.value.objective;
        this.model.briefOutlineScope = this.formDescription.value.briefOutlineScope;
        this.model.output = this.formDescription.value.output;
        this.model.needJustification = this.formDescription.value.needJustification;
        this.model.totalAmount = this.formEstimatedCost.value.total;
        this.model.gobAmount = this.formEstimatedCost.value.gob;
        this.model.feGobAmount = this.formEstimatedCost.value.gobFe;
        this.model.ownFundAmount = this.formEstimatedCost.value.ownFund;
        this.model.feOwnFundAmount = this.formEstimatedCost.value.ownFundFe;
        this.model.paAmount = this.formEstimatedCost.value.pa;
        this.model.rpaAmount = this.formEstimatedCost.value.rpa;
        this.model.dpaAmount = this.formEstimatedCost.value.dpa;
        this.model.otherAmount = this.formEstimatedCost.value.other;
        this.model.feOtherAmount = this.formEstimatedCost.value.feOther;
        this.model.methodologyOfConductingStudy = this.formImplementingModality.value.methodology;
        this.model.financingArrangement = this.formImplementingModality.value.financing;
        this.model.listOfMachinery = this.formImplementingModality.value.listOfMachinery;
        this.model.projectConceptMasterUuid = this.projectConceptUuid;
        this.model.projectConceptMasterId = this.projectConceptId;
        this.model.uuid = this.uuid;

        if (this.formSummary.valid && this.formDescription.valid && this.formEstimatedCost.valid && this.formImplementingModality.valid) {
            this.spinner = true;
            this.feasibilityStudyProposalSummaryService.update(this.model).subscribe(res => {
                if (res.uuid) {
                    this.feasibilityProposalHelperService.feasibilityProposalCreateId = res.id;
                    this.feasibilityProposalHelperService.feasibilityUpdate = true;
                    // this.formSummary.reset();
                    // this.formDescription.reset();
                    // this.formEstimatedCost.reset();
                    // this.formImplementingModality.reset();
                    this.expenditureCostService.feasibilitySummarySaveClickEvent();
                    this.modeOfFinanceService.feasibilitySummarySaveClickEvent();
                    this.visitPlanService.feasibilitySummarySaveClickEvent();
                    this.workPlanService.feasibilitySummarySaveClickEvent();
                    this.vendorManagementService.feasibilitySummarySaveClickEvent();
                    this.committeeService.feasibilitySummarySaveClickEvent();
                    this.snackBar.openSuccessSnackBarWithMessage('Successfully Update Data', OK);
                    this.spinner = false;
                    this.nextStep.emit(true);
                }
            }, err => {
                this.spinner = false;
                this.snackBar.openErrorSnackBarWithMessage('Failed to update data', ERROR);
            });
        } else {
            this.formSummary.markAllAsTouched();
            this.formDescription.markAllAsTouched();
            this.formEstimatedCost.markAllAsTouched();
            this.formImplementingModality.markAllAsTouched();
            this.snackBar.openWarnSnackBarWithMessage("You missed some required field, Please fill all the required field", "Ok");
        }
    }

    // fs proposal summary create function
    updateAndExit() {
        this.model.titleEn = this.formSummary.value.enTitle;
        this.model.titleBn = this.formSummary.value.bnTitle;
        this.model.sponsoringMinistry = this.ministry_name;
        this.model.executingAgency = this.agency_name;
        this.model.dateOfCommencement = this.formSummary.value.dateCommencement;
        this.model.dateOfCompletion = this.formSummary.value.dateCompletion;
        this.model.background = this.formDescription.value.background;
        this.model.objective = this.formDescription.value.objective;
        this.model.briefOutlineScope = this.formDescription.value.briefOutlineScope;
        this.model.output = this.formDescription.value.output;
        this.model.needJustification = this.formDescription.value.needJustification;
        this.model.totalAmount = this.formEstimatedCost.value.total;
        this.model.gobAmount = this.formEstimatedCost.value.gob;
        this.model.feGobAmount = this.formEstimatedCost.value.gobFe;
        this.model.ownFundAmount = this.formEstimatedCost.value.ownFund;
        this.model.feOwnFundAmount = this.formEstimatedCost.value.ownFundFe;
        this.model.paAmount = this.formEstimatedCost.value.pa;
        this.model.rpaAmount = this.formEstimatedCost.value.rpa;
        this.model.dpaAmount = this.formEstimatedCost.value.dpa;
        this.model.otherAmount = this.formEstimatedCost.value.other;
        this.model.feOtherAmount = this.formEstimatedCost.value.feOther;
        this.model.methodologyOfConductingStudy = this.formImplementingModality.value.methodology;
        this.model.financingArrangement = this.formImplementingModality.value.financing;
        this.model.listOfMachinery = this.formImplementingModality.value.listOfMachinery;
        this.model.projectConceptMasterUuid = this.projectConceptUuid;
        this.model.projectConceptMasterId = this.projectConceptId;
        this.model.uuid = this.uuid;

        if (this.formSummary.valid && this.formDescription.valid && this.formEstimatedCost.valid && this.formImplementingModality.valid) {
            this.spinner = true;
            this.feasibilityStudyProposalSummaryService.update(this.model).subscribe(res => {
                if (res.uuid) {
                    this.feasibilityProposalHelperService.feasibilityProposalCreateId = res.id;
                    // this.formSummary.reset();
                    // this.formDescription.reset();
                    // this.formEstimatedCost.reset();
                    // this.formImplementingModality.reset();
                    this.snackBar.openSuccessSnackBarWithMessage('Successfully Update Data', OK);
                    this.spinner = false;
                    this.router.navigate(['feasibility-study/edit-dashboard/' + this.route.snapshot.paramMap.get('uuid')]);
                }
            }, err => {
                this.spinner = false;
                this.snackBar.openErrorSnackBarWithMessage('Failed to update data', ERROR);
            });
        } else {
            this.formSummary.markAllAsTouched();
            this.formDescription.markAllAsTouched();
            this.formEstimatedCost.markAllAsTouched();
            this.formImplementingModality.markAllAsTouched();
            this.snackBar.openWarnSnackBarWithMessage("You missed some required field, Please fill all the required field", "Ok");
        }
    }

    /**
     * For Expanding CK Editor
     * @param i
     */
    expand(i: number): void {
        if (i === 1) {
            this.expBackground = true;
        }
        if (i === 2) {
            this.expObjective = true;
        }
        if (i === 3) {
            this.expBriefOutlineScope = true;
        }
        if (i === 4) {
            this.expOutput = true;
        }
        if (i === 5) {
            this.expNeedJustification = true;
        }
        if (i === 6) {
            this.expMethodology = true;
        }
        if (i === 7) {
            this.expFinancing = true;
        }
        if (i === 8) {
            this.listOfMachinery = true;
        }
    }

    /**
     * For Collapsing CK Editor
     * @param i
     */
    collapse(i: number): void {
        if (i === 1) {
            this.expBackground = false;
        }
        if (i === 2) {
            this.expObjective = false;
        }
        if (i === 3) {
            this.expBriefOutlineScope = false;
        }
        if (i === 4) {
            this.expOutput = false;
        }
        if (i === 5) {
            this.expNeedJustification = false;
        }
        if (i === 6) {
            this.expMethodology = false;
        }
        if (i === 7) {
            this.expFinancing = false;
        }
        if (i === 8) {
            this.listOfMachinery = false;
        }
    }


    // set total value on changing own fund
    onOwnFundChange($event: FocusEvent) {
        if ($event.target['value']) {
            this.formEstimatedCost.patchValue({
                total: Number($event.target['value']) +
                    (this.formEstimatedCost.value.pa ? this.formEstimatedCost.value.pa : 0) +
                    (this.formEstimatedCost.value.gob ? this.formEstimatedCost.value.gob : 0) +
                    (this.formEstimatedCost.value.other ? this.formEstimatedCost.value.other : 0)
            });
        }
    }

    feGoBChange($event: Event) {
        const feValue = ($event.target['value']) ? Number($event.target['value']) : 0;
        const gobValue = this.formEstimatedCost.value.gob ? this.formEstimatedCost.value.gob : 0;
        if (feValue > gobValue) {
            this.snackBar.openErrorSnackBarWithMessage("Fe can’t be greater than GOB", ERROR);
            this.formEstimatedCost.patchValue({ gobFe: 0 });
        }
    }

    feOwnFundBChange($event: KeyboardEvent) {
        const feOwnFundValue = ($event.target['value']) ? Number($event.target['value']) : 0;
        const ownFundValue = this.formEstimatedCost.value.ownFund ? this.formEstimatedCost.value.ownFund : 0;
        if (feOwnFundValue > ownFundValue) {
            this.snackBar.openErrorSnackBarWithMessage("Fe can’t be greater than Own Fund", ERROR);
            this.formEstimatedCost.patchValue({ ownFundFe: 0 });
        }
    }

    feOtherChange($event: KeyboardEvent) {
        const feOtherValue = ($event.target['value']) ? Number($event.target['value']) : 0;
        const otherValue = this.formEstimatedCost.value.other ? this.formEstimatedCost.value.other : 0;
        if (feOtherValue > otherValue) {
            this.snackBar.openErrorSnackBarWithMessage("Fe can’t be greater than Other", ERROR);
            this.formEstimatedCost.patchValue({ feOther: 0 });
        }
    }

    // set total value on changing gob
    onGobChange($event: FocusEvent) {
        if ($event.target['value']) {
            this.formEstimatedCost.patchValue({
                total: Number($event.target['value']) +
                    (this.formEstimatedCost.value.pa ? this.formEstimatedCost.value.pa : 0) +
                    (this.formEstimatedCost.value.ownFund ? this.formEstimatedCost.value.ownFund : 0) +
                    (this.formEstimatedCost.value.other ? this.formEstimatedCost.value.other : 0)
            });
        }
    }

    // set pa value on changing rpa
    onRpaChange($event: FocusEvent) {
        if ($event.target['value']) {
            this.formEstimatedCost.patchValue({
                pa: Number($event.target['value']) + (this.formEstimatedCost.value.dpa ? this.formEstimatedCost.value.dpa : 0),
            });
            this.onPaChange();
        }
    }

    // set pa value on changing rpa
    onDpaChange($event: FocusEvent) {
        if ($event.target['value']) {
            this.formEstimatedCost.patchValue({
                pa: Number($event.target['value']) + (this.formEstimatedCost.value.rpa ? this.formEstimatedCost.value.rpa : 0),
            });
            this.onPaChange();
        }
    }

    // set total value on changing pa
    onPaChange() {
        this.formEstimatedCost.patchValue({
            total: (this.formEstimatedCost.value.rpa ? this.formEstimatedCost.value.rpa : 0) +
                (this.formEstimatedCost.value.dpa ? this.formEstimatedCost.value.dpa : 0) +
                (this.formEstimatedCost.value.gob ? this.formEstimatedCost.value.gob : 0) +
                (this.formEstimatedCost.value.ownFund ? this.formEstimatedCost.value.ownFund : 0) +
                (this.formEstimatedCost.value.other ? this.formEstimatedCost.value.other : 0)
        });
    }

    // set total value on changing other
    onOtherChange($event: FocusEvent) {
        if ($event.target['value']) {
            this.formEstimatedCost.patchValue({
                total: Number($event.target['value']) +
                    (this.formEstimatedCost.value.pa ? this.formEstimatedCost.value.pa : 0) +
                    (this.formEstimatedCost.value.ownFund ? this.formEstimatedCost.value.ownFund : 0) +
                    (this.formEstimatedCost.value.gob ? this.formEstimatedCost.value.gob : 0)
            });
        }
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

}
