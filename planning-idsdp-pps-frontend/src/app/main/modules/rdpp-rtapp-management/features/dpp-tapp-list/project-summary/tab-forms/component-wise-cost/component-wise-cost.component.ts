import {Component, OnInit} from '@angular/core';
/*----Lng Translation----*/
import {locale as lngEnglish} from './i18n/en';
import {locale as lngBangla} from './i18n/bn';
import {FuseTranslationLoaderService} from '../../../../../../../core/services/translation-loader.service';
import {DppProjectSummeryHelperService} from "../../../../../services/dpp-project-summery-helper.service";
import {UnsubscribeAdapterComponent} from "../../../../../../../core/helper/unsubscribeAdapter";
import {DppAnnualPhasingCostService} from "../../../../../services/dpp-annual-phasing-cost.service";
import { ActivatedRoute } from '@angular/router';
import {IDppAnnexure5ACostTotal} from "../../../../../models/dpp-annexure5A-cost-total";
import {IDppAnnualPhasingEstimatedCostTabDetails} from "../../../../../models/dpp-annual-phasing-estimated-cost-tab-details";
import {ProjectSummaryService} from "../../../../../../project-concept-management/services/project-summary.service";
import {DppAnnualPhasingConstant} from "../../../../../constants/dpp-annual-phasing.constant";
import {NumberPipe} from "../../../../../../../shared/pipes/number-pipe.pipe";
import {IProjectConcept} from "../../../../../../project-concept-management/models/project-concept";
import { RdppAnnualPhasingCostService } from 'app/main/modules/rdpp-rtapp-management/services/rdpp-annual-phasing-cost.service';
import { ITppPhasingCostTotal } from 'app/main/modules/dpp-tapp-management/models/tpp-phasing-cost-total';
import { IDppPhasingCostTotal } from 'app/main/modules/dpp-tapp-management/models/dpp-phasing-cost-total';
import { RdppObjectiveCostService } from 'app/main/modules/rdpp-rtapp-management/services/rdpp-objective-cost.service';
import { ProjectMovementService } from 'app/main/modules/rdpp-rtapp-management/services/project-movement.service';
import { ProjectMovementStageModel } from 'app/main/modules/rdpp-rtapp-management/models/project.movement.model';
import { StatusStage } from 'app/main/modules/dpp-tapp-management/constants/stage-status-constant';
import { DppAnnualPhasingCostTabDetailsWithName } from 'app/main/modules/rdpp-rtapp-management/models/dpp-annual-phasing-cost-tab-details-with-name.model';
import { RdppReportService } from 'app/main/modules/rdpp-rtapp-management/services/rdpp-report.service';
import { IDppAnnualPhasingCostTabDetails } from 'app/main/modules/dpp-tapp-management/models/dpp-annual-phasing-cost-tab-details';
import { IFiscalYearRequest } from 'app/main/modules/rdpp-rtapp-management/models/fiscal-year-request';

/*----/Lng Translation----*/
// ===================
export class CurrentMovementStage {
    id: string;
    currentStage: string;
    movementTime: string;
    userId: number;
}

@Component({
    selector: 'app-component-wise-cost',
    templateUrl: './component-wise-cost.component.html',
    styleUrls: ['./component-wise-cost.component.scss']
})

export class ComponentWiseCostComponent extends UnsubscribeAdapterComponent implements OnInit {

    val: any = '0.00';
    blankVal: any = 0;
    conceptUuid: any;

    rdppMasterId: number;
    conceptId: number;
    revenueTotal: IDppAnnexure5ACostTotal;
    capitalTotal: IDppAnnexure5ACostTotal;
    grantTotal: IDppAnnexure5ACostTotal;
    revenueList: IDppAnnualPhasingEstimatedCostTabDetails [] = [];
    capitalList: IDppAnnualPhasingEstimatedCostTabDetails [] = [];
    dppAnnualPhasingCostTabDetails: IDppAnnualPhasingCostTabDetails [] = [];
    physicalContingencyTotal: IDppAnnualPhasingEstimatedCostTabDetails;
    priceContingencyTotal: IDppAnnualPhasingEstimatedCostTabDetails;
    show: boolean = true;
    isForeignAid: boolean;
    uuid: string;
    projectSummary: IProjectConcept;
    fiscalYearList: any[] = [];
    rdppFiscalYearList: any[] = [];
    revFiscalDataList: any[] = [];
    revSubFiscalDataList: any[] = [];
    phyContingencySubFiscalDataList: any[] = [];
    priContingencySubFiscalDataList: any[] = [];
    grantTotalList: any[] = [];
    revEstimatedCostList: any[] = [];
    arrayListOfList: any[] = [];
    capSubFiscalYearWiseList: any[] = [];
    capFiscalYearWiseList: any[] = [];
    totalAmountAnnexure5B: number;
    rtappGrandList: { fiscalYear: string, tappAnnualPhasingCostTotal: ITppPhasingCostTotal } [] = [];
    rdppGrandList: { fiscalYear: string, dppAnnualPhasingCostTotal: IDppPhasingCostTotal } [] = [];
    rtappGrandTotal: number;
    rdppGrandTotal: number;
    rdppRtappMasterId: number;
    revisedVersion: string;
    referenceId: number;

    projectMovementModel: ProjectMovementStageModel = new ProjectMovementStageModel();
    currentMovementStage: CurrentMovementStage = new CurrentMovementStage();
    statusStage = new StatusStage();

    projectStatus: string;
    isEnLabel: boolean;
    spinner: boolean = false;

    // revenueTotal: IDppPhasingCostTotal;
    // capitalTotal: IDppPhasingCostTotal;
    phyContingencySubTotal: IDppPhasingCostTotal;
    priceContingencySubTotal: IDppPhasingCostTotal;
    grantCostTotal: IDppPhasingCostTotal;
    // revenueList: { fiscalYear: string, dppAnnualPhasingCostTotal: IDppPhasingCostTotal } [] = [];
    // capitalList: { fiscalYear: string, dppAnnualPhasingCostTotal: IDppPhasingCostTotal } [] = [];
    // grandList: { fiscalYear: string, dppAnnualPhasingCostTotal: IDppPhasingCostTotal } [] = [];
    // revItem:  any = [];
    revItemCumulative: DppAnnualPhasingCostTabDetailsWithName [] = [];
    fiscalYears?: IFiscalYearRequest [] = [];
    capItemCumulative: DppAnnualPhasingCostTabDetailsWithName [] = [];
    revItemYearWIse: {fiscalYear: DppAnnualPhasingCostTabDetailsWithName} [] = [];
    capItemYearWIse: {fiscalYear: DppAnnualPhasingCostTabDetailsWithName} [] = [];
    contingencyItemYearWIse: {fiscalYear: DppAnnualPhasingCostTabDetailsWithName} [] = [];

    revDataList: any[] = [];
    capItemWiseCumList: any[] = [];
    contingencyList: any[] = [];
    grandTotalList: any[] = [];
    revDataListFy: any[] = [];
    revDataYear: any[] = [];
        fRevDList: any[] = [];
        fCapDList: any[] = [];
        fContPhyDList: any[] = [];
        fContPriDList: any[] = [];
        fGrdDList: any[] = [];
        // fRevDobj: any= {};

    newFyDVal: any= {};
    capItemWiseCum: any= {};
    revItemWiseCum: any= {};
    contingencyCumO: any= {};
    contingencyCumI: any= {};
    contingency: any;
    grandTotal: any;
    // revItemWiseCum: any;

    arrayOfRevDataList: Array<{revDataList: any, revDataListFy: any}> = [];
    allArrayOfRevDataList: Array<{capItemWiseCum: any, contingency: any, grandTotal: any, revItemWiseCum: any}> = [];
    fRevDobj: any;
    fiscalYearWiseCost: { fiscalYear: string, values: IFiscalYearRequest[], dppAnnualPhasingCostTotal?: IDppPhasingCostTotal }[] = [];
    rdResL: any;
    capDataForFiscal: any;

    constructor(
        private route: ActivatedRoute,
        private projectSummaryService: ProjectSummaryService,
        private annualPhasingCostService: DppAnnualPhasingCostService,
        public numberPipe : NumberPipe,
        private rdppAnnualPhasingCostService: RdppAnnualPhasingCostService,
        private rdppObjectiveCostService: RdppObjectiveCostService,
        private projectMovementService: ProjectMovementService,
        private _rdppReportService : RdppReportService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService) {
        super();
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
        // this.getProjectSummaryByPcUuid();
    }

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            this.conceptUuid = params['pcUuid'];
            this.rdppMasterId = params['id'];
        });
        this.getDetailsEstimatedCostInRdpp();
        this.getDetailsEstimatedCostInDpp();
        this.getRdppGrandTotal(this.rdppMasterId);
        this.getObjectiveCost();
        this.getProjectSummaryByPcUuid();
        this.rdpLloadFiscalYear();
    }

    /*----Go back to dashboard----*/
    goBackToHome() {
        window.history.back();
    }

    getProjectSummaryByPcUuid(): any {
        this.subscribe$.add(
            this.projectSummaryService.getByUuid(this.conceptUuid).subscribe(res => {
                if(res) {
                    this.projectSummary = res;
                    this.isForeignAid = res.isForeignAid;
                }
            })
        );
    }

    getDetailsEstimatedCostInRdpp(): any {
        this.annualPhasingCostService.getDetailsEstimatedCostInRdpp(this.rdppMasterId).subscribe(res => {
            this.revEstimatedCostList = res?.revenue?.estimatedCostTabDetailsDTOS;
            if(res.dppAnnualPhasingCostDTOList.length > 0) {
                this.setDetailsEstimatedCost(res);
                this.grantTotal = res.grandTotalResponses;
                this.show = false;
            }
        })
    }

    private getDetailsEstimatedCostInDpp() {
        this.subscribe$.add(
            this.annualPhasingCostService.getDetailsEstimatedCost(this.conceptUuid).subscribe(res => {
                this.setDetailsEstimatedCost(res);
                this.grantTotal = res.grandTotalResponses;
                this.show = false;
            })
        );
    }

    setDetailsEstimatedCost(res) {
        res.dppAnnualPhasingCostDTOList.forEach(e => {
            if (e.componentName === DppAnnualPhasingConstant.Revenue_Component) {
                this.revenueList = e.estimatedCostTabDetailsDTOS;
                this.revenueTotal = e.dppAnnualPhasingCostTotal;
            } else if (e.componentName === DppAnnualPhasingConstant.Capital_Component) {
                this.capitalList = e.estimatedCostTabDetailsDTOS;
                this.capitalTotal = e.dppAnnualPhasingCostTotal;
            } else if (e.componentName === DppAnnualPhasingConstant.Contingency) {
                this.physicalContingencyTotal = e.estimatedCostTabDetailsDTOS[0];
                this.priceContingencyTotal = e.estimatedCostTabDetailsDTOS[1];
            }
        });

    }

    private getRdppGrandTotal(rdppMasterId: number) {
        this.rdppAnnualPhasingCostService.getGrandTotalByProjectConceptId(rdppMasterId).subscribe(res => {
            if (res.length > 1) {
                let total = res.filter(r => r.dppAnnualPhasing == DppAnnualPhasingConstant.Grand_Total).map(e => e.dppAnnualPhasingCostTotal)[0];
                this.totalAmountAnnexure5B = total[0].gobAmount, total[0].gobThruAmount + total[0].spAcAmount + total[0].thruDpAmount + total[0].thruPdAmount, total[0].ownFundAmount, total[0].otherAmount;
                this.fiscalYearList = res.filter(f => f.dppAnnualPhasing === DppAnnualPhasingConstant.Revenue_Component)[0]?.grandTotal.map(m => ({fiscalYear: m.fiscalYear}));
                this.rdppGrandList = res.filter(f => f.dppAnnualPhasing === DppAnnualPhasingConstant.Grand_Total) ?
                    res.filter(f => f.dppAnnualPhasing === DppAnnualPhasingConstant.Grand_Total)[0]?.grandTotal : [];
                this.rdppGrandTotal = 0;
                this.fiscalYearList?.forEach((data, index)=>{
                    this.rdppGrandTotal += this.rdppGrandList[index]?.dppAnnualPhasingCostTotal?.totalAmount;
                })
            }
        });

    }

    rdpLloadFiscalYear(): any {
        this.rdppAnnualPhasingCostService.fiscalYearList.subscribe(res => {
            this.rdppFiscalYearList = res;
            this.rdppFiscalYearList.forEach(e => {
                this.initFiscalYearWiseData(e.fiscalYear);
            });
        });
    }
    private getData(fiscalYear: string) {
        return {
            id: null,
            uuid: null,
            fiscalYear: fiscalYear,
            quantity: 0,
            gobAmount: 0,
            gobFeAmount: 0,
            gobThruAmount: 0,
            spAcAmount: 0,
            thruPdAmount: 0,
            thruDpAmount: 0,
            ownFundAmount: 0,
            ownFundFeAmount: 0,
            otherAmount: 0,
            otherFeAmount: 0,
            totalAmount: 0
        };
    }
    private initFiscalYearWiseData(fiscalYear: string) {
        const values = [];
        values.push(this.getData(fiscalYear));
        this.fiscalYearWiseCost.push(
            {
                fiscalYear: fiscalYear,
                values: values,
                dppAnnualPhasingCostTotal: this.getData(fiscalYear)
            }
        );
    }

    getObjectiveCost() {
        this.spinner = true;
        this._rdppReportService.getObjectiveCost(this.conceptUuid).subscribe(res => {
            this.revDataList = res.partAItemWIseCumulative?.revItemWiseCum;
            this.capItemWiseCumList = res.partAItemWIseCumulative?.capItemWiseCum;
            this.capItemWiseCum = res.partAItemWIseCumulative?.capItemWiseCum?.dppAnnualPhasingCostTotal;
            this.contingencyCumO = res.partAItemWIseCumulative?.contingency?.dppAnnualPhasingCostTabDetails[0];
            this.contingencyCumI= res.partAItemWIseCumulative?.contingency?.dppAnnualPhasingCostTabDetails[1];
            this.contingencyList = res.partAItemWIseCumulative?.contingency;
            this.grandTotalList = res.partAItemWIseCumulative?.grandTotal[3]?.grandTotal ? res.partAItemWIseCumulative?.grandTotal[3]?.grandTotal : [];

            //////////////////fis//////////////////////////////////////////////////////////////////
            this.rdResL = res;
            this.capDataForFiscal = res?.partAItemWIseCumulative?.capItemWiseCum;
            this.fiscalYearList = res.fiscalYearList;
            this.fRevDList = res.partAItemWIseCumulative?.revItemWiseCum?.fiscalYearWiseCost ? res.partAItemWIseCumulative?.revItemWiseCum?.fiscalYearWiseCost : [];
            this.fRevDobj = res.partAItemWIseCumulative?.revItemWiseCum?.fiscalYearWiseCost?.dppAnnualPhasingCostTotal?.fiscalYear;
            this.fCapDList = res?.partAItemWIseCumulative?.capItemWiseCum?.fiscalYearWiseCost ? res?.partAItemWIseCumulative?.capItemWiseCum?.fiscalYearWiseCost : [];
            this.fGrdDList = res.partAItemWIseCumulative?.grandTotal?.fiscalYearWiseCost;
            this.fContPhyDList = res.partAItemWIseCumulative?.contingency?.fiscalYearWiseCost ? res.partAItemWIseCumulative?.contingency?.fiscalYearWiseCost: [];
            this.fContPriDList = res.partAItemWIseCumulative?.contingency?.fiscalYearWiseCost;
            this.revItemWiseCum = res.partAItemWIseCumulative.revItemWiseCum;
            this.allArrayOfRevDataList.push({capItemWiseCum: this.capItemWiseCum, contingency: this.contingency, grandTotal: this.grandTotal, revItemWiseCum: this.revItemWiseCum});
            this.arrayListOfList = this.allArrayOfRevDataList;
            this.revDataListFy = res.partAItemWIseCumulative?.revItemWiseCum?.fiscalYearWiseCost[0]?.values;
            this.arrayOfRevDataList.push({ revDataList: this.revDataList, revDataListFy: this.revDataListFy });
            // this.fiscalYearList
            this.revFiscalDataList = res.partAItemWIseCumulative?.revItemWiseCum;
            this.revSubFiscalDataList = res.partAItemWIseCumulative?.revItemWiseCum?.fiscalYearWiseCost;
            this.rdppFiscalYearList = res.partAItemWIseCumulative?.revItemWiseCum?.fiscalYearWiseCost;
            this.phyContingencySubFiscalDataList = res.partAItemWIseCumulative?.contingency?.fiscalYearWiseCost;
            this.priContingencySubFiscalDataList = res.partAItemWIseCumulative?.contingency?.fiscalYearWiseCost;
            this.grantTotalList = res.partAItemWIseCumulative?.grandTotal[3]?.grandTotal;
            this.capSubFiscalYearWiseList = res.partAItemWIseCumulative?.capItemWiseCum?.fiscalYearWiseCost;
            this.capFiscalYearWiseList = res.partAItemWIseCumulative?.capItemWiseCum?.dppAnnualPhasingCostTabDetails;
            this.getGrandTotal(res.partAItemWIseCumulative);
            this.spinner = false;
            }, error => {
                this.spinner = false;
            }

        )
    }

    private getGrandTotal(res) {
        this.spinner = true;
    }


}
