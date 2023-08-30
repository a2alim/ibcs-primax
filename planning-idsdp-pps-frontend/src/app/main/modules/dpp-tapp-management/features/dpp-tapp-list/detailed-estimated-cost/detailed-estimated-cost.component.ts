import {Component, OnInit} from '@angular/core';
import {locale as lngEnglish} from './i18n/en';
import {locale as lngBangla} from './i18n/bn';
import {FuseTranslationLoaderService} from '../../../../../core/services/translation-loader.service';
import {ActivatedRoute} from '@angular/router';
import {UnsubscribeAdapterComponent} from "../../../../../core/helper/unsubscribeAdapter";
import {DppAnnualPhasingCostService} from "../../../services/dpp-annual-phasing-cost.service";
import {IDppAnnualPhasingEstimatedCostTabDetails} from "../../../models/dpp-annual-phasing-estimated-cost-tab-details";
import {IDppAnnexure5ACostTotal} from "../../../models/dpp-annexure5A-cost-total";
import {ProjectSummaryService} from "../../../../project-concept-management/services/project-summary.service";
import {DppAnnualPhasingConstant} from '../../../constants/dpp-annual-phasing.constant';
import {IProjectConcept} from "../../../../project-concept-management/models/project-concept";
import {NumberPipe} from "../../../../../shared/pipes/number-pipe.pipe";
import {TranslateService} from "@ngx-translate/core";
import {AgencyService} from "../../../../configuration-management/services/agency.service";

@Component({
    selector: 'app-detailed-estimated-cost',
    templateUrl: './detailed-estimated-cost.component.html',
    styleUrls: ['./detailed-estimated-cost.component.scss']
})
export class DetailedEstimatedCostComponent extends UnsubscribeAdapterComponent implements OnInit {

    val: any = '0.00';
    blankVal : any = 0;
    conceptUuid = this.route.snapshot.params['id'];
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
    titleEn: string;
    projectSummary: IProjectConcept;
    paripatraVersion: any;
    isParipatra2016: boolean;
    agencyModel: any;

    constructor(
        private route: ActivatedRoute,
        private projectSummaryService: ProjectSummaryService,
        private annualPhasingCostService: DppAnnualPhasingCostService,
        public numberPipe : NumberPipe,
        private _translateService: TranslateService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private agencyService: AgencyService) {
        super();
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

    ngOnInit(): void {
        // this.conceptUuid = this.route.snapshot.params['id'];
        this.getAll();
        this.getProjectSummary();
    }

    // for get ProjectSummary
    private getProjectSummary() {
        this.projectSummaryService.getByUuid(this.conceptUuid).subscribe(res => {

            this.paripatraVersion = res.paripatraVersion.nameEn;
            if (res.paripatraVersion.nameEn == 'Paripatra 2016') {
                this.isParipatra2016 = true;
            } else {
                this.isParipatra2016 = false;
            }


            this.titleEn = res.titleEn;
            if (res.isForeignAid) {
                this._translateService.use('en');
            } else {
                this._translateService.use('bn');
            }
            this.projectSummary = res;
            this.getAgency();
        });
    }

    private getAgency() {
        this.agencyService.getById(this.projectSummary.agencyId).subscribe(res => {
            this.agencyModel = res;
        })
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

    public convertToBanglaNumber(value) {
        const numbers = {
            0: '০',
            1: '১',
            2: '২',
            3: '৩',
            4: '৪',
            5: '৫',
            6: '৬',
            7: '৭',
            8: '৮',
            9: '৯'
        };

        let output = '';
        const input = value.toString();
        for (let i = 0; i < input.length; ++i) {
            if (numbers.hasOwnProperty(input.charAt(i))) {
                output = output + numbers[input[i]];
            }else{
                output = output + input.charAt(i);
            }
        }
        return output;
    }
}
