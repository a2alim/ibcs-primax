import {Component, OnInit} from '@angular/core';
import {FuseNavigationService} from '@fuse/components/navigation';

import {locale as lngEnglish} from './i18n/en';
import {locale as lngBangla} from './i18n/bn';
import {FuseTranslationLoaderService} from 'app/main/core/services/translation-loader.service';
import {ProjectSummaryService} from 'app/main/modules/project-concept-management/services/project-summary.service';
import {ActivatedRoute} from '@angular/router';
import {FormBuilder} from '@angular/forms';
import {UnsubscribeAdapterComponent} from 'app/main/core/helper/unsubscribeAdapter';
import {TappAnnualPhasingCostService} from '../../../services/tapp-annual-phasing-cost.service';
import {IDppAnnexure5ACostTotal} from '../../../models/dpp-annexure5A-cost-total';
import {IDppAnnualPhasingEstimatedCostTabDetails} from '../../../models/dpp-annual-phasing-estimated-cost-tab-details';
import {DppAnnualPhasingConstant} from '../../../constants/dpp-annual-phasing.constant';
import {AgencyService} from "../../../../configuration-management/services/agency.service";
import {IProjectConcept} from "../../../../project-concept-management/models/project-concept";
import {NumberPipe} from "../../../../../shared/pipes/number-pipe.pipe";

@Component({
    selector: 'app-annexure-i-a',
    templateUrl: './annexure-i-a.component.html',
    styleUrls: ['./annexure-i-a.component.scss']
})
export class AnnexureIAComponent extends UnsubscribeAdapterComponent implements OnInit {
    toggleMenuBarPreviousValue: any;
    title: string;
    conceptId: string;
    conceptUuid: any;

    revenueTotal: IDppAnnexure5ACostTotal;
    capitalTotal: IDppAnnexure5ACostTotal;
    grantTotal: IDppAnnexure5ACostTotal;
    revenueList: IDppAnnualPhasingEstimatedCostTabDetails [] = [];
    capitalList: IDppAnnualPhasingEstimatedCostTabDetails [] = [];
    physicalContingencyTotal: IDppAnnualPhasingEstimatedCostTabDetails;
    priceContingencyTotal: IDppAnnualPhasingEstimatedCostTabDetails;
    show: boolean = true;
    isForeignAid: boolean;
    isParipatra2016: boolean;
    agencyModel: any;
    projectSummary: IProjectConcept;

    constructor(private _fuseNavigationService: FuseNavigationService,
                private _fuseTranslationLoaderService: FuseTranslationLoaderService,
                private _formBuilder: FormBuilder,
                private activatedRoute: ActivatedRoute,
                private projectSummaryService: ProjectSummaryService,
                private tappAnnualPhasingCostService: TappAnnualPhasingCostService,
                private agencyService: AgencyService,
                public numberPipe: NumberPipe,
    ) {
        super();
        this._fuseTranslationLoaderService.loadTranslations(
            lngEnglish,
            lngBangla
        );
    }

    ngOnInit(): void {
        this.activatedRoute.params.subscribe(res => {
            this.conceptId = res['id'];
            this.conceptUuid = this.activatedRoute.snapshot.params['id'];
        });

        this.getAll();
    }

    getAll() {
        this.subscribe$.add(
            this.projectSummaryService.getByUuid(this.conceptUuid).subscribe(res => {
                this.isParipatra2016 = res.isParipatra2016;
                this.isForeignAid = res.isForeignAid;
                this.title = res.isForeignAid ? res.titleEn : res.titleBn;
                this.projectSummary = res;
                this.getAgency();
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

    private getAgency() {
        this.agencyService.getById(this.projectSummary.agencyId).subscribe(res => {
            this.agencyModel = res;
        })
    }

    goBackToHome() {
        // this.toggleMenuBar(this.toggleMenuBarPreviousValue);
        window.history.back();
    }

    toggleMenuBar(value: boolean) {
        const navigation = this._fuseNavigationService.getComponent('mainNavigation');
        if (navigation) {
            this.toggleMenuBarPreviousValue = navigation.opened;
            navigation.opened = value;
        }
    }
}
