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
import {RtappAnnualPhasingCostService} from "../../../../../services/rtapp-annual-phasing-cost.service";
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
    masterId: number;
    revenueTotal: IDppAnnexure5ACostTotal;
    capitalTotal: IDppAnnexure5ACostTotal;
    grantTotal: IDppAnnexure5ACostTotal;
    revenueList: IDppAnnualPhasingEstimatedCostTabDetails [] = [];
    capitalList: IDppAnnualPhasingEstimatedCostTabDetails [] = [];
    physicalContingencyTotal: IDppAnnualPhasingEstimatedCostTabDetails;
    priceContingencyTotal: IDppAnnualPhasingEstimatedCostTabDetails;
    show: boolean = true;
    isForeignAid: boolean;

    rtappAnnualPhasingCost: any[] = [];

    constructor(
        private route: ActivatedRoute,
        private projectSummaryService: ProjectSummaryService,
        private rtappAnnualPhasingCostService: RtappAnnualPhasingCostService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService) {
        super();
        this.route.queryParams.subscribe(params => {
            this.conceptUuid = params['pcUuid'];
            this.masterId = params['id'];
        });

        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

    ngOnInit(): void {
        this.getAll();
    }

    /*----Go back to dashboard----*/
    goBackToHome() {
        window.history.back();
    }

    private getAll() {
        this.subscribe$.add(
            this.projectSummaryService.getByUuid(this.conceptUuid).subscribe(res => {
                this.isForeignAid = res.isForeignAid;
            })
        );

        this.subscribe$.add(
            this.rtappAnnualPhasingCostService.getDetailsEstimatedCost(this.masterId).subscribe(res => {
                console.log('economic code wise cost : ',res);
                this.rtappAnnualPhasingCost = res;
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
