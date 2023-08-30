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

/*----/Lng Translation----*/


@Component({
    selector: 'app-component-wise-cost',
    templateUrl: './component-wise-cost.component.html',
    styleUrls: ['./component-wise-cost.component.scss']
})


export class ComponentWiseCostComponent extends UnsubscribeAdapterComponent implements OnInit {

    val: any = '0.00';
    blankVal: any = 0;
    conceptUuid: any;
    paripatraVersion: any;
    conceptId: number;
    revenueTotal: IDppAnnexure5ACostTotal;
    capitalTotal: IDppAnnexure5ACostTotal;
    grantTotal: IDppAnnexure5ACostTotal;
    revenueList: IDppAnnualPhasingEstimatedCostTabDetails [] = [];
    capitalList: IDppAnnualPhasingEstimatedCostTabDetails [] = [];
    physicalContingencyTotal: IDppAnnualPhasingEstimatedCostTabDetails;
    priceContingencyTotal: IDppAnnualPhasingEstimatedCostTabDetails;
    show: boolean = true;
    isForeignAid: boolean;

    projectSummary: IProjectConcept;
    isParipatra2016: boolean;

    constructor(
        private route: ActivatedRoute,
        private projectSummaryService: ProjectSummaryService,
        private annualPhasingCostService: DppAnnualPhasingCostService,
        public numberPipe : NumberPipe,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService) {
        super();
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

    ngOnInit(): void {
        this.conceptUuid = this.route.snapshot.params['id'];
        this.getAll();
    }

    /*----Go back to dashboard----*/
    goBackToHome() {
        window.history.back();
    }

    getAll() {
        this.subscribe$.add(
            this.projectSummaryService.getByUuid(this.conceptUuid).subscribe(res => {

                this.paripatraVersion = res.paripatraVersion.nameEn;
                if (res.paripatraVersion.nameEn == 'Paripatra 2016') {
                    this.isParipatra2016 = true;
                } else {
                    this.isParipatra2016 = false;
                }


                if(res) {
                    this.projectSummary = res;
                    this.isForeignAid = res.isForeignAid;
                }
            })

        );

        this.subscribe$.add(
            this.annualPhasingCostService.getDetailsEstimatedCost(this.conceptUuid).subscribe(res => {
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
                this.grantTotal = res.grandTotalResponses;
                this.show = false;
            })
        );
    }
}
