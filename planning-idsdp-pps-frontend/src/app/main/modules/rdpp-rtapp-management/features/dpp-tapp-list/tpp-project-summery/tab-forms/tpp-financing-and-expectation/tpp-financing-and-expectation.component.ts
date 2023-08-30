import {Component, EventEmitter, OnInit, Output} from '@angular/core';
/*----Lng Translation----*/
import {locale as lngEnglish} from './i18n/en';
import {locale as lngBangla} from './i18n/bn';
import {FuseTranslationLoaderService} from '../../../../../../../core/services/translation-loader.service';
import {ActivatedRoute, Router} from "@angular/router";
import {ProjectSummaryService} from "../../../../../../project-concept-management/services/project-summary.service";
import { IProjectConcept } from 'app/main/modules/project-concept-management/models/project-concept';
import { ITppPhasingCostTotal } from 'app/main/modules/rdpp-rtapp-management/models/tpp-phasing-cost-total';
import { IFiscalYearRequest } from 'app/main/modules/rdpp-rtapp-management/models/fiscal-year-request';
import { NumberPipe } from 'app/main/shared/pipes/number-pipe.pipe';
import { UnsubscribeAdapterComponent } from 'app/main/core/helper/unsubscribeAdapter';
import { DppAnnualPhasingConstant } from 'app/main/modules/rdpp-rtapp-management/constants/dpp-annual-phasing.constant';
import { RtappAnnualPhasingCostService } from 'app/main/modules/rdpp-rtapp-management/services/rtapp-annual-phasing-cost.service';
import { ITppAnnualPhasingCostTabDetails } from 'app/main/modules/rdpp-rtapp-management/models/tpp-annual-phasing-cost-tab-details';
import { EconomicCodeService } from 'app/main/modules/configuration-management/services/economic-code-service.service';
import { SubEconomicCodeService } from 'app/main/modules/configuration-management/services/sub-economic-code.service';
import { SubEconomicCodeModel } from 'app/main/modules/configuration-management/models/sub-economic-code-model';
import { EconomicTypeModel } from 'app/main/modules/configuration-management/models/economic-code-model';
import { TappObjectiveCostService } from 'app/main/modules/rdpp-rtapp-management/services/tapp-objective-cost.service';
/*----/Lng Translation----*/
@Component({
    selector: 'app-tpp-financing-and-expectation',
    templateUrl: './tpp-financing-and-expectation.component.html',
    styleUrls: ['./tpp-financing-and-expectation.component.scss']
})
export class TppFinancingAndExpectationComponent extends UnsubscribeAdapterComponent implements OnInit {

    conceptUuid: string;
    rtappMasterId: number;
    projectSummary: IProjectConcept;
    cumulativeDate: string;
    show: boolean = true;
    isForeignAid: boolean;

    economicCodeList: EconomicTypeModel[]=[];
    subEconomicCodeList: SubEconomicCodeModel[] = [];

    fiscalYearList: { fiscalYear: string; }[]=[];

    revenueItemList: ITppAnnualPhasingCostTabDetails[]=[];
    revenueSubTotal: ITppPhasingCostTotal =  {} as ITppPhasingCostTotal;
    fiscalYearWiseRevenueCostList: { fiscalYear: string; values: IFiscalYearRequest[]; tappAnnualPhasingCostTotal: ITppPhasingCostTotal; }[]=[];

    capitalItemList: ITppAnnualPhasingCostTabDetails[]=[];
    capitalSubTotal: ITppPhasingCostTotal =  {} as ITppPhasingCostTotal;
    fiscalYearWiseCapitalCostList: { fiscalYear: string; values: IFiscalYearRequest[]; tappAnnualPhasingCostTotal: ITppPhasingCostTotal; }[]=[];

    contingencyItemList: ITppAnnualPhasingCostTabDetails[]=[];
    fiscalYearWiseContingencyCostList: { fiscalYear: string; values: IFiscalYearRequest[]; tappAnnualPhasingCostTotal: ITppPhasingCostTotal; }[]=[];

    grandTotal: ITppPhasingCostTotal = {} as ITppPhasingCostTotal;
    fiscalYearWiseGrandTotalList: { fiscalYear: string; tappAnnualPhasingCostTotal: ITppPhasingCostTotal }[]=[];

    constructor(
        private route: ActivatedRoute,
        private projectSummaryService: ProjectSummaryService,
        public numberPipe : NumberPipe,
        private rtappObjectiveCostService: TappObjectiveCostService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private rtappAnnualPhasingCostService : RtappAnnualPhasingCostService,
        private economicCodeService: EconomicCodeService,
        private subEconomicCodeService: SubEconomicCodeService,
        private router: Router,
    ) {
        super();
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            this.conceptUuid = params['pcUuid'];
            this.rtappMasterId = params['id'];
        });
        this.getCumulativeDate();
        this.getRevenueComponentDataInRtapp();
        this.getCapitalComponentDataInRtapp();
        this.getCapitalContiengencyDataInRtapp();
        this.getGrandTotal();
    }

    getCumulativeDate() {
        this.rtappObjectiveCostService.getCumulativeDate(this.rtappMasterId, this.conceptUuid).subscribe((res) =>{
            this.cumulativeDate = res.res;
        })
    }

    private getProjectSummery(){
        this.projectSummaryService.getByUuid(this.conceptUuid).pipe(

        )
    }

    private getRevenueComponentDataInRtapp(): any {
        this.show = true;
        this.rtappAnnualPhasingCostService.getByProjectConceptIdAndComponentName({
            rtappMasterId: this.rtappMasterId,
            componentName: DppAnnualPhasingConstant.Revenue_Component
        }).subscribe(res => {
            if (res){
                // console.log('Revenue data list : ', res);
                this.fiscalYearList = res.fiscalYearWiseCost.map(m => ({fiscalYear: m.fiscalYear}));
                this.revenueItemList = res.tappAnnualPhasingCostTabDetails;
                this.fiscalYearWiseRevenueCostList = res.fiscalYearWiseCost;
                this.sumOfSubTotal(this.revenueSubTotal, this.revenueItemList);
                this.getEconomicCodeList(res.tappAnnualPhasingCostTabDetails.map(m => m.economicCodeId), this.revenueItemList);
                this.getSubEconomicCodeList(res.tappAnnualPhasingCostTabDetails.map(m => m.subEconomicCodeId), this.revenueItemList);
            }
            this.show = false;
        });
    }

    private getCapitalComponentDataInRtapp(): any {
        this.show = true;
        this.rtappAnnualPhasingCostService.getByProjectConceptIdAndComponentName({
            rtappMasterId: this.rtappMasterId,
            componentName: DppAnnualPhasingConstant.Capital_Component
        }).subscribe(res => {
            if (res){
                // console.log('Capital data list : ', res);
                this.capitalItemList = res.tappAnnualPhasingCostTabDetails;
                this.fiscalYearWiseCapitalCostList = res.fiscalYearWiseCost;
                this.sumOfSubTotal(this.capitalSubTotal, this.capitalItemList);
                this.getEconomicCodeList(res.tappAnnualPhasingCostTabDetails.map(m => m.economicCodeId), this.capitalItemList);
                this.getSubEconomicCodeList(res.tappAnnualPhasingCostTabDetails.map(m => m.subEconomicCodeId), this.capitalItemList);
            }
            this.show = false;
        });
    }

    private getCapitalContiengencyDataInRtapp(): any {
        this.show = true;
        this.rtappAnnualPhasingCostService.getByProjectConceptIdAndComponentName({
            rtappMasterId: this.rtappMasterId,
            componentName: DppAnnualPhasingConstant.Contingency
        }).subscribe(res => {
            if (res){
                // console.log('Contiengency data list : ', res);
                this.contingencyItemList = res.tappAnnualPhasingCostTabDetails;
                this.fiscalYearWiseContingencyCostList = res.fiscalYearWiseCost;
            }
            this.show = false;
        });
    }

    private getGrandTotal() {
        this.subscribe$.add(
            this.rtappAnnualPhasingCostService.getGrandTotalByProjectConceptId(this.rtappMasterId).subscribe(
                res => {
                    // console.log('grand total : ', res);
                    if (res[0].grandTotal.length > 0) {
                        this.grandTotal = res.find(f => f.componentName === DppAnnualPhasingConstant.Grand_Total)?.tappAnnualPhasingCostTotal[0];
                        this.fiscalYearWiseGrandTotalList = res.find(f => f.componentName === DppAnnualPhasingConstant.Grand_Total) ?
                            res.filter(f => f.componentName === DppAnnualPhasingConstant.Grand_Total)[0]?.grandTotal : [];
                    }
                    this.show = false;
                }
            )
        );
    }

    private sumOfSubTotal(subTotal, itemList) {
        subTotal.qty = itemList?.reduce((sum, current) => sum + current?.qty, 0);
        subTotal.quantity = itemList?.reduce((sum, current) => sum + current?.quantity, 0);
        subTotal.totalAmount = itemList?.reduce((sum, current) => sum + current?.totalAmount, 0)
        subTotal.gobAmount = itemList?.reduce((sum, current) => sum + current?.gobAmount, 0);
        subTotal.gobFeAmount = itemList?.reduce((sum, current) => sum + current?.gobFeAmount, 0);
        subTotal.gobThruAmount = itemList?.reduce((sum, current) => sum + current?.gobThruAmount, 0);
        subTotal.spAcAmount = itemList?.reduce((sum, current) => sum + current?.spAcAmount, 0);
        subTotal.thruPdAmount = itemList?.reduce((sum, current) => sum + current?.thruPdAmount, 0);
        subTotal.thruDpAmount = itemList?.reduce((sum, current) => sum + current?.thruDpAmount, 0);
        subTotal.ownFundAmount = itemList?.reduce((sum, current) => sum + current?.ownFundAmount, 0);
        subTotal.ownFundFeAmount = itemList?.reduce((sum, current) => sum + current?.ownFundFeAmount, 0);
        subTotal.otherAmount = itemList?.reduce((sum, current) => sum + current?.otherAmount, 0);
        subTotal.otherFeAmount = itemList?.reduce((sum, current) => sum + current?.otherFeAmount, 0);
    }

    private getEconomicCodeList(economicCodes: any[], itemList: ITppAnnualPhasingCostTabDetails[]): void {
        this.subscribe$.add(
            this.economicCodeService.getByIdSet(economicCodes).subscribe(
                res => this.mapEconomicCodes(itemList, res),
                err =>console.log('getEconomicCodeList error : ', err)
            )
        );
    }

    private getSubEconomicCodeList(subEconomicCodes: any[], itemList: ITppAnnualPhasingCostTabDetails[]): void {
        this.subscribe$.add(
            this.subEconomicCodeService.getByIdSet(subEconomicCodes).subscribe(
                res => this.mapSubEconomicCodes(itemList, res),
                err => console.log('getSubEconomicCodeList error : ', err)
            )
        );
    }

    private mapEconomicCodes(itemList, economicCodeList){
        itemList.forEach(item => {
            item.economicCode = economicCodeList.find(code => item.economicCodeId == code.id);
        });
    }

    private mapSubEconomicCodes(itemList, subEconomicCodeList){
        itemList.forEach(item => {
            item.subEconomicCode = subEconomicCodeList.find(subEconomicCode => item.subEconomicCodeId == subEconomicCode.id);
        });
    }

    navigateToDashboard() {
        this.router.navigate(['/rdpp-rtapp/view-dashboard'], { queryParams: {pcUuid: this.conceptUuid, id: this.rtappMasterId}});
    }

    navigateToAnnexureIa(): any {
        this.router.navigate(['rdpp-rtapp/tapp-annexure-goods-first'], {queryParams: {pcUuid: this.conceptUuid, id: this.rtappMasterId}});
    }

    navigateToAnnexureIb(): any {
        this.router.navigate(['rdpp-rtapp/tapp-annexure-service'], {queryParams: {pcUuid: this.conceptUuid, id: this.rtappMasterId}});
    }

    navigateToAnnexureII(): any {
        this.router.navigate(['rdpp-rtapp/rtapp-annexure-two'], {queryParams: {pcUuid: this.conceptUuid, id: this.rtappMasterId}});
    }

    navigateToTAPP(): any {
        this.router.navigate([`dpp-tapp/view-dashboard/${this.conceptUuid}`]);
    }
}
