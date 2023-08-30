import { Component, OnInit } from '@angular/core';
/*----Lng Translation----*/
import {locale as lngEnglish} from './i18n/en';
import {locale as lngBangla} from './i18n/bn';
import {FuseTranslationLoaderService} from '../../../../../../../core/services/translation-loader.service';
import {IDppAnnexure5ACostTotal} from "../../../../../models/dpp-annexure5A-cost-total";
import {IDppAnnualPhasingEstimatedCostTabDetails} from "../../../../../models/dpp-annual-phasing-estimated-cost-tab-details";
import {ActivatedRoute} from "@angular/router";
import {ProjectSummaryService} from "../../../../../../project-concept-management/services/project-summary.service";
import {DppAnnualPhasingCostService} from "../../../../../services/dpp-annual-phasing-cost.service";
import {DppAnnualPhasingConstant} from "../../../../../constants/dpp-annual-phasing.constant";
import {UnsubscribeAdapterComponent} from "../../../../../../../core/helper/unsubscribeAdapter";
import {TappAnnualPhasingCostService} from "../../../../../services/tapp-annual-phasing-cost.service";
import {NumberPipe} from "../../../../../../../shared/pipes/number-pipe.pipe";
/*----/Lng Translation----*/
@Component({
  selector: 'app-tpp-component-wise-cost',
  templateUrl: './tpp-component-wise-cost.component.html',
  styleUrls: ['./tpp-component-wise-cost.component.scss']
})
export class TppComponentWiseCostComponent extends UnsubscribeAdapterComponent implements OnInit {
    val: any = '0.00';
    conceptUuid: any;
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
    paripatraVersion: string;
    isParipatra2016: boolean;

    constructor(
        private route: ActivatedRoute,
        private projectSummaryService: ProjectSummaryService,
        private tappAnnualPhasingCostService: TappAnnualPhasingCostService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        public numberPipe : NumberPipe) {
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

    private getAll() {
        this.subscribe$.add(
            this.projectSummaryService.getByUuid(this.conceptUuid).subscribe(res => {
                this.paripatraVersion = res.paripatraVersion.nameEn;
                if (res.paripatraVersion.nameEn == 'Paripatra 2016') {
                    this.isParipatra2016 = true;
                } else {
                    this.isParipatra2016 = false;
                }

                this.isForeignAid = res.isForeignAid;
            })
        );

        this.subscribe$.add(
            this.tappAnnualPhasingCostService.getDetailsEstimatedCost(this.conceptUuid).subscribe(res => {
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
