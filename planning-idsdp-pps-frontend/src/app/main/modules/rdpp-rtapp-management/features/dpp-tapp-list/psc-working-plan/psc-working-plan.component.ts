import {Component, OnInit} from '@angular/core';
import {UtilsService} from "../../../../../core/services/utils.service";
import {FormControl, FormGroup} from "@angular/forms";
import {MEDIUM_EDITOR_CONFIG, MIN_EDITOR_CONFIG} from "../../../../../core/constants/editor-config";
import {ActivatedRoute} from "@angular/router";
import {UnsubscribeAdapterComponent} from "../../../../../core/helper/unsubscribeAdapter";
import {ProjectSummaryService} from "../../../../project-concept-management/services/project-summary.service";
import {IProjectConcept} from "../../../../project-concept-management/models/project-concept";
import {DppObjectiveCostService} from "../../../services/dpp-objective-cost.service";
import {DppAnnualPhasingConstant} from "../../../constants/dpp-annual-phasing.constant";
import {DppAnnualPhasingCostService} from "../../../services/dpp-annual-phasing-cost.service";
import {TappAnnualPhasingCostService} from "../../../services/tapp-annual-phasing-cost.service";
import {PscWorkingPlanModel} from "../../../models/psc-working-plan.model";
import {PscWorkingPlanService} from "../../../services/psc-working-plan.service";
import {OK, SUCCESSFULLY_UPDATED} from "../../../../../core/constants/message";
import {SnackbarHelper} from "../../../../../core/helper/snackbar.helper";
import {DppObjectiveCostModel} from "../../../models/dppObjectiveCost.model";
import {TappObjectiveCostModel} from "../../../models/tappObjectiveCost.model";
import {FuseTranslationLoaderService} from "../../../../../core/services/translation-loader.service";
import {TappObjectiveCostService} from "../../../services/tapp-objective-cost.service";
import {DivisionModel} from "../../../../configuration-management/models/division.model";
import {IDppLocationWiseCostBreakdown} from "../../../models/dpp-location-wise-cost-breakdown.model";
import {UpazillaModel} from "../../../../configuration-management/models/upazilla.model";
import {DppLocationWiseCostBreakdownService} from "../../../services/dpp-location-wise-cost-breakdown.service";
import {DppLocationService} from "../../../services/dpp-location.service";
import {NumberPipe} from "../../../../../shared/pipes/number-pipe.pipe";

@Component({
    selector: 'app-psc-working-plan',
    templateUrl: './psc-working-plan.component.html',
    styleUrls: ['./psc-working-plan.component.scss']
})
export class PscWorkingPlanComponent extends UnsubscribeAdapterComponent implements OnInit {

    minEditorConfig: any = MIN_EDITOR_CONFIG;
    mediumEditorConfig: any = MEDIUM_EDITOR_CONFIG;
    form: FormGroup;
    lbl6: boolean = true;
    lbl7: boolean = true;
    lbl8: boolean = true;
    lbl9: boolean = true;
    lbl10: boolean = true;
    lbl11ka: boolean = true;
    lbl11kha: boolean = true;
    lbl11ga: boolean = true;
    lbl11gha: boolean = true;
    lbl11umo: boolean = true;
    lbl11cha: boolean = true;

    conceptId: string;
    projectSummary: IProjectConcept;
    pscWorkingPlan: PscWorkingPlanModel;
    objectiveCost: DppObjectiveCostModel | TappObjectiveCostModel;
    grandGob: number = 0;
    grandGobFe: number = 0;
    grandPa: number = 0;
    grandPaRpa: number = 0;
    grandOwnFund: number = 0;
    grandOwnFundFe: number = 0;
    grandOthers: number = 0;
    grandOthersFe: number = 0;
    show = true;

    // project location
    locationWiseCost: IDppLocationWiseCostBreakdown[] = [];
    locations: { id: number, uuid: string, dppMasterId: number, divisions: DivisionModel[] };
    upazilas: { sl: any, dSpan: number, zSpan: number, location: IDppLocationWiseCostBreakdown, upazila: UpazillaModel }[] = [];

    constructor(private utilsService: UtilsService,
                private route: ActivatedRoute,
                private dppObjectiveCostService: DppObjectiveCostService,
                private tappObjectiveCostService: TappObjectiveCostService,
                private dppAnnualPhasingCostService: DppAnnualPhasingCostService,
                private tappAnnualPhasingCostService: TappAnnualPhasingCostService,
                private projectSummaryService: ProjectSummaryService,
                private costBreakdownService: DppLocationWiseCostBreakdownService,
                private locationService: DppLocationService,
                public numberPipe: NumberPipe,
                private snackbarHelper: SnackbarHelper,
                private pscWorkingPlanService: PscWorkingPlanService) {
        super();
    }

    ngOnInit(): void {
        this.populateForm();
        this.route.params.subscribe(params => {
            this.conceptId = params['id'];
            this.getProjectConceptById();
        });
    }

    save() {
        this.form.patchValue({
            projectConceptMasterId: this.projectSummary.id,
            projectConceptUuid: this.projectSummary.uuid,
        })
        this.form.value.id ? this.update() : this.create();
    }

    create() {
        this.subscribe$.add(
            this.pscWorkingPlanService.create(this.form.value).subscribe(res => {
                    if (res.id) {
                        this.snackbarHelper.openSuccessSnackBar();
                        this.pscWorkingPlan = res;
                        this.setPscWorkingPlanData(res);
                    } else {
                        this.snackbarHelper.openErrorSnackBar();
                    }
                }, error => this.snackbarHelper.openErrorSnackBarWithMessage(error.message, error.status)
            )
        );
    }

    update() {
        this.subscribe$.add(
            this.pscWorkingPlanService.update(this.form.value).subscribe(res => {
                    if (res.id) {
                        this.snackbarHelper.openSuccessSnackBarWithMessage(SUCCESSFULLY_UPDATED, OK);
                        this.pscWorkingPlan = res;
                        this.setPscWorkingPlanData(res);
                    } else {
                        this.snackbarHelper.openErrorSnackBar();
                    }
                }, error => this.snackbarHelper.openErrorSnackBarWithMessage(error.message, error.status)
            )
        );
    }

    private getProjectConceptById() {
        this.subscribe$.add(
            this.projectSummaryService.getByUuid(this.conceptId).subscribe(res => {
                    this.projectSummary = res;
                    if (res.projectTypeDTO.nameEn.toLowerCase() === 'dpp') {
                        this.getDppObjectiveAndCostByProjectConceptId();
                        this.getDppGrandTotal(res.id);
                    } else {
                        this.getTappGrandTotal(res.id);
                        this.getTappObjectiveAndCostByProjectConceptId();
                    }
                    this.getByLocationWiseCostProjectConceptMasterId(res.id);
                    this.getPscWorkingPlan(res.id);
                }
            )
        );
    }

    private getPscWorkingPlan(id: number) {
        this.subscribe$.add(
            this.pscWorkingPlanService.getByPcId(id).subscribe(res => {
                    if (res) {
                        this.pscWorkingPlan = res;
                        this.setPscWorkingPlanData(res);
                    }
                }
            )
        );
    }

    private getDppObjectiveAndCostByProjectConceptId() {
        this.subscribe$.add(
            this.dppObjectiveCostService.getByProjectConceptUuid(this.conceptId).subscribe(res => {
                    this.objectiveCost = res.res;
                    this.totalModeOfFinance(res);
                }
            )
        );
    }

    private getByLocationWiseCostProjectConceptMasterId(id) {
        this.subscribe$.add(
            this.costBreakdownService.getByProjectConceptMasterId(id).subscribe(res => {
                this.locationWiseCost = res;
                this.getLocationByObjectCostId(id);
            })
        );
    }

    private getLocationByObjectCostId(id) {
        this.subscribe$.add(
            this.locationService.getLocationByObjectiveCostIdUsingProjectSummary(id).subscribe(res => {
                if (res) {
                    this.locations = res;
                    this.arrangeData(res);
                } else {
                    this.show = true;
                    this.snackbarHelper.openWarnSnackBarWithMessage("Require to save Part-A (Project Summary)", OK);
                }
            }, _ => {
                this.show = true;
            })
        );
    }

    private arrangeData(res) {
        let di = 0;
        res.divisions.forEach(d => {
            let zi = 0;
            let upazilaUnderDivision = d.zillaList.reduce((sum, current) => sum + current.upaZillaList.length, 0)
            d.zillaList.forEach(z => {
                let ui = 0;
                z.upaZillaList.forEach(u => {
                    const serial = this.numberPipe.convertToBanglaNumber(di + 1);
                    const lwc: IDppLocationWiseCostBreakdown = this.locationWiseCost.find(f => f.upazilaId === u.id);
                    this.upazilas.push(
                        {
                            location: {
                                uuid: lwc ? lwc.uuid : null,
                                id: lwc ? lwc.id : null,
                                dppMasterId: res.dppMasterId,
                                rdppMasterId: res.dppMasterId,
                                divisionId: u.zilla.division.id,
                                zillaId: u.zilla.id,
                                upazilaId: u.id,
                                projectConceptMasterId: this.projectSummary.id,
                                projectConceptMasterUuid: this.conceptId,
                                comment: lwc ? lwc.comment : '',
                                estimatedCost: lwc ? lwc.estimatedCost : 0,
                                quantity: lwc ? lwc.quantity : null,
                            },
                            sl: serial,
                            dSpan: ((zi === 0 && ui === 0) ? upazilaUnderDivision : 0),
                            zSpan: ((ui === 0) ? (d.zillaList[zi].upaZillaList.length) : 0),
                            upazila: u
                        }
                    );
                    ui += 1;
                    // this.saveDisable = this.upazilas.some(m => m.location.estimatedCost <= 0) && this.upazilas.some(m => m.location.quantity <= 0);
                });
                zi += 1;
            });
            di += 1;
        });
        this.show = true;
    }

    totalModeOfFinance(res) {
        this.grandGob = res.res.modeFinanceList.map(e => e.gob).reduce((sum, current) => sum + current, 0);
        this.grandGobFe = res.res.modeFinanceList.map(e => e.gobFe).reduce((sum, current) => sum + current, 0);
        this.grandPa = res.res.modeFinanceList.map(e => e.pa).reduce((sum, current) => sum + current, 0);
        this.grandPaRpa = res.res.modeFinanceList.map(e => e.paRpa).reduce((sum, current) => sum + current, 0);
        this.grandOwnFund = res.res.modeFinanceList.map(e => e.ownFund).reduce((sum, current) => sum + current, 0);
        this.grandOwnFundFe = res.res.modeFinanceList.map(e => e.ownFundFe).reduce((sum, current) => sum + current, 0);
        this.grandOthers = res.res.modeFinanceList.map(e => e.others).reduce((sum, current) => sum + current, 0);
        this.grandOthersFe = res.res.modeFinanceList.map(e => e.othersFe).reduce((sum, current) => sum + current, 0);
    }

    private getTappObjectiveAndCostByProjectConceptId() {
        this.subscribe$.add(
            this.tappObjectiveCostService.getProjectConceptByUuid(this.conceptId).subscribe(res => {
                    this.objectiveCost = res.res;
                }
            )
        );
    }

    private setPscWorkingPlanData(res: PscWorkingPlanModel) {
        this.form.patchValue({
            id: res.id,
            uuid: res.uuid,
            projectConceptMasterId: res.projectConceptMasterId,
            projectConceptUuid: res.projectConceptUuid,
            sanctionSchedule: res.sanctionSchedule,
            projectPurpose: res.projectPurpose,
            mainActivity: res.mainActivity,
            partWiseExpense: res.partWiseExpense,
            projectReason: res.projectReason,
            analysisBackground: res.analysisBackground,
            consistencyAnalysis: res.consistencyAnalysis,
            projectPrinciple: res.projectPrinciple,
            analysisType: res.analysisType,
            rationalityAnalysis: res.rationalityAnalysis,
            relatedOtherSubjects: res.relatedOtherSubjects,
        });
    }

    private getDppGrandTotal(conceptId: number) {
        this.dppAnnualPhasingCostService.getGrandTotalByProjectConceptId(conceptId).subscribe(res => {
            if (res.length > 1) {
                let total = res.filter(r => r.dppAnnualPhasing == DppAnnualPhasingConstant.Grand_Total).map(e => e.dppAnnualPhasingCostTotal)[0];
                this.projectSummary.totalAmount = total[0].totalAmount;
                this.projectSummary.gobAmount = total[0].gobAmount;
                this.projectSummary.paAmount = total[0].gobThruAmount + total[0].spAcAmount + total[0].thruDpAmount + total[0].thruPdAmount;
                this.projectSummary.ownFundAmount = total[0].ownFundAmount;
                this.projectSummary.otherAmount = total[0].otherAmount;
            }
        });
    }

    private getTappGrandTotal(conceptId: number) {
        this.tappAnnualPhasingCostService.getGrandTotalByProjectConceptId(conceptId).subscribe(res => {
            if (res.length > 1) {
                let total = res.filter(r => r.componentName == DppAnnualPhasingConstant.Grand_Total).map(e => e.tappAnnualPhasingCostTotal)[0];
                this.projectSummary.totalAmount = total[0].totalAmount;
                this.projectSummary.gobAmount = total[0].gobAmount;
                this.projectSummary.paAmount = total[0].gobThruAmount + total[0].spAcAmount + total[0].thruDpAmount + total[0].thruPdAmount;
                this.projectSummary.ownFundAmount = total[0].ownFundAmount;
                this.projectSummary.otherAmount = total[0].otherAmount;
            }
        });
    }

    private populateForm(): void {
        this.form = new FormGroup({
            id: new FormControl(''),
            uuid: new FormControl(''),
            projectConceptMasterId: new FormControl(''),
            projectConceptUuid: new FormControl(''),
            sanctionSchedule: new FormControl(''),
            projectPurpose: new FormControl(''),
            mainActivity: new FormControl(''),
            partWiseExpense: new FormControl(''),
            projectReason: new FormControl(''),
            analysisBackground: new FormControl(''),
            consistencyAnalysis: new FormControl(''),
            projectPrinciple: new FormControl(''),
            analysisType: new FormControl(''),
            rationalityAnalysis: new FormControl(''),
            relatedOtherSubjects: new FormControl('')
        });
        this.show = false;
    }

    uploadImageAsBase64(files: any, propertyName: string) {
        this.utilsService.uploadImageAsBase64(this.form, files, propertyName);
    }

    expand(i: number): void {
        if (i === 1) {
            this.lbl6 = true;
        } else if (i === 2) {
            this.lbl7 = true;
        } else if (i === 3) {
            this.lbl8 = true;
        } else if (i === 4) {
            this.lbl9 = true;
        } else if (i === 5) {
            this.lbl10 = true;
        } else if (i === 6) {
            this.lbl11ka = true;
        } else if (i === 7) {
            this.lbl11kha = true;
        } else if (i === 8) {
            this.lbl11ga = true;
        } else if (i === 9) {
            this.lbl11gha = true;
        } else if (i === 10) {
            this.lbl11umo = true;
        } else if (i === 11) {
            this.lbl11cha = true;
        }
    }

    collapse(i: number): void {
        if (i === 1) {
            this.lbl6 = false;
        } else if (i === 2) {
            this.lbl7 = false;
        } else if (i === 3) {
            this.lbl8 = false;
        } else if (i === 4) {
            this.lbl9 = false;
        } else if (i === 5) {
            this.lbl10 = false;
        } else if (i === 6) {
            this.lbl11ka = false;
        } else if (i === 7) {
            this.lbl11kha = false;
        } else if (i === 8) {
            this.lbl11ga = false;
        } else if (i === 9) {
            this.lbl11gha = false;
        } else if (i === 10) {
            this.lbl11umo = false;
        } else if (i === 11) {
            this.lbl11cha = false;
        }
    }
}
