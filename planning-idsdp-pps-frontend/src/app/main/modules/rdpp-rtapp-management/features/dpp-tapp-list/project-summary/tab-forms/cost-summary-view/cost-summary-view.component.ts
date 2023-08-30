import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseTranslationLoaderService } from 'app/main/core/services/translation-loader.service';
import { ProjectSummaryService } from 'app/main/modules/project-concept-management/services/project-summary.service';
import { DppAnnualPhasingConstant } from 'app/main/modules/rdpp-rtapp-management/constants/dpp-annual-phasing.constant';
import { IDppPhasingCostTotal } from 'app/main/modules/rdpp-rtapp-management/models/dpp-phasing-cost-total';
import { FiscalYearWiseTotalCost } from 'app/main/modules/rdpp-rtapp-management/models/fiscal-year-wise-total-cost.model';
import { ITppPhasingCostTotal } from 'app/main/modules/rdpp-rtapp-management/models/tpp-phasing-cost-total';
import { RdppAnnualPhasingCostService } from 'app/main/modules/rdpp-rtapp-management/services/rdpp-annual-phasing-cost.service';
import { RtappAnnualPhasingCostService } from 'app/main/modules/rdpp-rtapp-management/services/rtapp-annual-phasing-cost.service';
import { locale as lngEnglish } from './i18n/en';
import { locale as lngBangla } from './i18n/bn';
import { TranslateService } from '@ngx-translate/core';
import { NumberPipe } from 'app/main/shared/pipes/number-pipe.pipe';
@Component({
  selector: 'app-cost-summary-view',
  templateUrl: './cost-summary-view.component.html',
  styleUrls: ['./cost-summary-view.component.scss']
})
export class CostSummaryViewComponent implements OnInit {

  @Output() nextStep = new EventEmitter<boolean>();
  @Output() backPrevious = new EventEmitter<boolean>();

  dppMasterId: number;
  projectSummeryId: number;
  conceptUuid: string;
  rdppRtappMasterId: number;

  spinner: boolean;
  dppId: number;

  currFiscalYearList: { fiscalYear: string }[] = [];
  currRevenueList: { fiscalYear: string, dppAnnualPhasingCostTotal: IDppPhasingCostTotal }[] = [];
  currCapitalList: { fiscalYear: string, dppAnnualPhasingCostTotal: IDppPhasingCostTotal }[] = [];
  currContingencyList: { fiscalYear: string, dppAnnualPhasingCostTotal: IDppPhasingCostTotal }[] = [];
  currPhysicalContingencyList: { fiscalYear: string, dppAnnualPhasingCostTotal: IDppPhasingCostTotal }[] = [];
  currPriceContingencyList: { fiscalYear: string, dppAnnualPhasingCostTotal: IDppPhasingCostTotal }[] = [];
  currGrandTotalList: { fiscalYear: string, dppAnnualPhasingCostTotal: IDppPhasingCostTotal }[] = [];

  refFiscalYearList: { fiscalYear: string }[] = [];
  refRevenueList: { fiscalYear: string, dppAnnualPhasingCostTotal: IDppPhasingCostTotal }[] = [];
  refCapitalList: { fiscalYear: string, dppAnnualPhasingCostTotal: IDppPhasingCostTotal }[] = [];
  refContingencyList: { fiscalYear: string, dppAnnualPhasingCostTotal: IDppPhasingCostTotal }[] = [];
  refPhysicalContingencyList: { fiscalYear: string, dppAnnualPhasingCostTotal: IDppPhasingCostTotal }[] = [];
  refPriceContingencyList: { fiscalYear: string, dppAnnualPhasingCostTotal: IDppPhasingCostTotal }[] = [];
  refGrandTotalList: { fiscalYear: string, dppAnnualPhasingCostTotal: IDppPhasingCostTotal }[] = [];

  refRevenueItems: IDppPhasingCostTotal[] = [];
  currRevenueItems: IDppPhasingCostTotal[] = [];
  refCapitalItems: IDppPhasingCostTotal[] = [];
  currCapitalItems: IDppPhasingCostTotal[] = [];

  refRevenueItemGTObj: FiscalYearWiseTotalCost= new FiscalYearWiseTotalCost();
  currRevenueItemGTObj: FiscalYearWiseTotalCost= new FiscalYearWiseTotalCost();
  refCapitalItemGTObj: FiscalYearWiseTotalCost= new FiscalYearWiseTotalCost();
  currCapitalItemGTObj: FiscalYearWiseTotalCost= new FiscalYearWiseTotalCost();

  refRevenueGTObj: FiscalYearWiseTotalCost = new FiscalYearWiseTotalCost();
  currRevenueGTObj: FiscalYearWiseTotalCost = new FiscalYearWiseTotalCost();
  refCapitalGTObj: FiscalYearWiseTotalCost = new FiscalYearWiseTotalCost();
  currCapitalGTObj: FiscalYearWiseTotalCost = new FiscalYearWiseTotalCost();
  refPhysicalContingencyGTObj: FiscalYearWiseTotalCost = new FiscalYearWiseTotalCost();
  currPhysicalContingencyGTObj: FiscalYearWiseTotalCost = new FiscalYearWiseTotalCost();
  refPriceContingencyGTObj: FiscalYearWiseTotalCost = new FiscalYearWiseTotalCost();
  currPriceContingencyGTObj: FiscalYearWiseTotalCost = new FiscalYearWiseTotalCost();
  refGrandTotalObj: FiscalYearWiseTotalCost = new FiscalYearWiseTotalCost();
  currGrandTotalObj: FiscalYearWiseTotalCost = new FiscalYearWiseTotalCost();
  isEnLabel: boolean;
  Math: any;
  Number: any;

  constructor(
    private _translateService: TranslateService,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private rdppAnnualPhasingCostService: RdppAnnualPhasingCostService,
    private rtappAnnualPhasingCostService: RtappAnnualPhasingCostService,
    private projectSummaryService: ProjectSummaryService,
    public numberPipe : NumberPipe,
  ) {
    this.isEnLabel = this._translateService.currentLang === 'en';
    this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    this.Math = Math;
    this.Number = Number;
  }

  ngOnInit(): void {
    this.activeRoute.queryParams.subscribe(params => {
      this.conceptUuid = params['pcUuid'];
      this.rdppRtappMasterId = params['id'];
    });
    this.getRdppGrandTotalByMasterId();
  }

  private getRdppGrandTotalByMasterId() {
    this.spinner = true;
    this.rdppAnnualPhasingCostService.getRdppGrandTotalByMasterId(this.rdppRtappMasterId).subscribe(
      res => {

        console.log('res ===> ', res);
        
        this.arrangeCurrentGrandTotalList(res.currentGrandTotal);
        this.arrangeReferenceGrandTotalList(res.referenceGrandTotal);

        if (res && res.referenceItemWiseRevenue && res.referenceItemWiseRevenue.dppAnnualPhasingCostTabDetails.length>0) {
          this.refRevenueItems = res.referenceItemWiseRevenue.dppAnnualPhasingCostTabDetails;
          this.refRevenueItemGTObj = res.referenceItemWiseRevenue.dppAnnualPhasingCostTotal;
        }
        if (res && res.currentItemWiseRevenue && res.currentItemWiseRevenue.dppAnnualPhasingCostTabDetails.length > 0) {
          this.currRevenueItems = res.currentItemWiseRevenue.dppAnnualPhasingCostTabDetails
          this.currRevenueItemGTObj = res.currentItemWiseRevenue.dppAnnualPhasingCostTotal;
        }

        if (res && res.referenceItemWiseCapital && res.referenceItemWiseCapital.dppAnnualPhasingCostTabDetails.length > 0) {
          this.refCapitalItems = res.referenceItemWiseCapital.dppAnnualPhasingCostTabDetails
          this.refCapitalItemGTObj = res.referenceItemWiseCapital.dppAnnualPhasingCostTotal;
        }
        if (res && res.currentItemWiseCapital && res.currentItemWiseCapital.dppAnnualPhasingCostTabDetails.length>0) {
          this.currCapitalItems = res.currentItemWiseCapital.dppAnnualPhasingCostTabDetails;
          this.currCapitalItemGTObj = res.currentItemWiseCapital.dppAnnualPhasingCostTotal;
        }
        this.calculateYearWiseGrandTotal();
      }, 
      error => {
          this.spinner = false;
      }
    );
  }

  arrangeCurrentGrandTotalList(currentGrandTotal){
    if (currentGrandTotal.length > 1) {
      this.currFiscalYearList = currentGrandTotal.filter(f => f.dppAnnualPhasing === DppAnnualPhasingConstant.Revenue_Component)[0]?.grandTotal.map(m => ({ fiscalYear: m.fiscalYear }));
      
      if(currentGrandTotal.filter(f => f.dppAnnualPhasing === DppAnnualPhasingConstant.Revenue_Component).length>0){
        this.currRevenueList = currentGrandTotal.filter(f => f.dppAnnualPhasing === DppAnnualPhasingConstant.Revenue_Component)[0]?.grandTotal;
        let cumulativeCost = {
          fiscalYear: '',
          dppAnnualPhasingCostTotal: currentGrandTotal.filter(f => f.dppAnnualPhasing === DppAnnualPhasingConstant.Revenue_Component)[0]?.dppAnnualPhasingCostTotal[0]
        };
        this.currRevenueList.push(cumulativeCost);
        this.currFiscalYearList.push(cumulativeCost);
      }

      if(currentGrandTotal.filter(f => f.dppAnnualPhasing === DppAnnualPhasingConstant.Capital_Component).length > 0){
        this.currCapitalList = currentGrandTotal.filter(f => f.dppAnnualPhasing === DppAnnualPhasingConstant.Capital_Component)[0].grandTotal;
        let cumulativeCost = {
          fiscalYear: '',
          dppAnnualPhasingCostTotal: currentGrandTotal.filter(f => f.dppAnnualPhasing === DppAnnualPhasingConstant.Capital_Component)[0]?.dppAnnualPhasingCostTotal[0]
        };
        this.currCapitalList.push(cumulativeCost);
      }
      
      if(currentGrandTotal.filter(f => f.dppAnnualPhasing === DppAnnualPhasingConstant.Contingency).length > 0){
        this.currContingencyList = currentGrandTotal.filter(f => f.dppAnnualPhasing === DppAnnualPhasingConstant.Contingency)[0]?.grandTotal;
        let physicalContingencyCumulativeCost = {
          fiscalYear: '',
          dppAnnualPhasingCostTotal: currentGrandTotal.filter(f => f.dppAnnualPhasing === DppAnnualPhasingConstant.Contingency)[0]?.dppAnnualPhasingCostTotal[0]
        };
        this.currPhysicalContingencyList.push(physicalContingencyCumulativeCost);
        let priceContingencyCumulativeCost = {
          fiscalYear: '',
          dppAnnualPhasingCostTotal: currentGrandTotal.filter(f => f.dppAnnualPhasing === DppAnnualPhasingConstant.Contingency)[0]?.dppAnnualPhasingCostTotal[1]
        };
        this.currPriceContingencyList.push(priceContingencyCumulativeCost);
      }
      
      if(currentGrandTotal.filter(f => f.dppAnnualPhasing === DppAnnualPhasingConstant.Grand_Total).length>0){
        this.currGrandTotalList = currentGrandTotal.filter(f => f.dppAnnualPhasing === DppAnnualPhasingConstant.Grand_Total)[0]?.grandTotal;
        let cumulativeCost = {
          fiscalYear: '',
          dppAnnualPhasingCostTotal: currentGrandTotal.filter(f => f.dppAnnualPhasing === DppAnnualPhasingConstant.Grand_Total)[0]?.dppAnnualPhasingCostTotal[0]
        };
        this.currGrandTotalList.push(cumulativeCost);
      }

      let length = this.currContingencyList.length;
      if (length > 0) {
        this.currContingencyList.forEach((e, i) => {
          if (i < (length / 2)) {
            this.currPhysicalContingencyList.push(e);
          } else {
            this.currPriceContingencyList.push(e);
          }
        });
      }
    }
  }

  arrangeReferenceGrandTotalList(referenceGrandTotal){
    if (referenceGrandTotal.length > 1) {
      this.refFiscalYearList = referenceGrandTotal.filter(f => f.dppAnnualPhasing === DppAnnualPhasingConstant.Revenue_Component)[0]?.grandTotal.map(m => ({ fiscalYear: m.fiscalYear }));
      this.refRevenueList = referenceGrandTotal.filter(f => f.dppAnnualPhasing === DppAnnualPhasingConstant.Revenue_Component).length > 0 ?
        referenceGrandTotal.filter(f => f.dppAnnualPhasing === DppAnnualPhasingConstant.Revenue_Component)[0]?.grandTotal : [];
      this.refCapitalList = referenceGrandTotal.filter(f => f.dppAnnualPhasing === DppAnnualPhasingConstant.Capital_Component).length > 0 ?
        referenceGrandTotal.filter(f => f.dppAnnualPhasing === DppAnnualPhasingConstant.Capital_Component)[0].grandTotal : [];
      this.refContingencyList = referenceGrandTotal.filter(f => f.dppAnnualPhasing === DppAnnualPhasingConstant.Contingency).length > 0 ?
        referenceGrandTotal.filter(f => f.dppAnnualPhasing === DppAnnualPhasingConstant.Contingency)[0]?.grandTotal : [];
      this.refGrandTotalList = referenceGrandTotal.filter(f => f.dppAnnualPhasing === DppAnnualPhasingConstant.Grand_Total) ?
        referenceGrandTotal.filter(f => f.dppAnnualPhasing === DppAnnualPhasingConstant.Grand_Total)[0]?.grandTotal : [];

      let length = this.refContingencyList.length;
      if (length > 0) {
        this.refContingencyList.forEach((e, i) => {
          if (i < (length / 2)) {
            this.refPhysicalContingencyList.push(e);
          } else {
            this.refPriceContingencyList.push(e);
          }
        });
      }
    }
  }

  calculateYearWiseGrandTotal() {

    this.currFiscalYearList?.forEach((data, index) => {

      this.arrangeGrandTotalData(this.currRevenueGTObj, this.currRevenueList, index);
      this.arrangeGrandTotalData(this.currCapitalGTObj, this.currCapitalList, index);
      this.arrangeGrandTotalData(this.currPriceContingencyGTObj, this.currPriceContingencyList, index);
      this.arrangeGrandTotalData(this.currPhysicalContingencyGTObj, this.currPhysicalContingencyList, index);
      this.arrangeGrandTotalData(this.currGrandTotalObj, this.currGrandTotalList, index);
      this.spinner = false;
    });

    this.refFiscalYearList.forEach((data, index) => {

      this.arrangeGrandTotalData(this.refRevenueGTObj, this.refRevenueList, index);
      this.arrangeGrandTotalData(this.refCapitalGTObj, this.refCapitalList, index);
      this.arrangeGrandTotalData(this.refPriceContingencyGTObj, this.refPriceContingencyList, index);
      this.arrangeGrandTotalData(this.refPhysicalContingencyGTObj, this.refPhysicalContingencyList, index);
      this.arrangeGrandTotalData(this.refGrandTotalObj, this.refGrandTotalList, index);
      this.spinner = false;
    });
    this.spinner = false;
  }

  arrangeGrandTotalData(dataObj: any, fromList: any, index: number){
    if(fromList.length>0){
      dataObj.fiscalYear += fromList[index]?.dppAnnualPhasingCostTotal?.fiscalYear + ', ';
      dataObj.qty += fromList[index]?.dppAnnualPhasingCostTotal?.qty;
      dataObj.totalAmount += fromList[index]?.dppAnnualPhasingCostTotal?.totalAmount;
      dataObj.gobAmount += fromList[index]?.dppAnnualPhasingCostTotal?.gobAmount;
      dataObj.gobFeAmount += fromList[index]?.dppAnnualPhasingCostTotal?.gobFeAmount;
      dataObj.gobThruAmount += fromList[index]?.dppAnnualPhasingCostTotal?.gobThruAmount;
      dataObj.spAcAmount += fromList[index]?.dppAnnualPhasingCostTotal?.spAcAmount;
      dataObj.thruPdAmount += fromList[index]?.dppAnnualPhasingCostTotal?.thruPdAmount;
      dataObj.thruDpAmount += fromList[index]?.dppAnnualPhasingCostTotal?.thruDpAmount;
      dataObj.ownFundAmount += fromList[index]?.dppAnnualPhasingCostTotal?.ownFundAmount;
      dataObj.ownFundFeAmount += fromList[index]?.dppAnnualPhasingCostTotal?.ownFundFeAmount;
      dataObj.otherAmount += fromList[index]?.dppAnnualPhasingCostTotal?.otherAmount;
      dataObj.otherFeAmount += fromList[index]?.dppAnnualPhasingCostTotal?.otherFeAmount;
    }
  }

  /**
 * Save and next
 */
  saveAndNext(): any {
    this.nextStep.emit(true);
  }

  /**
  * Save and Exit
  */
  saveAndExit(): void {
    this.router.navigate(['/rdpp-rtapp/view-dashboard'], { queryParams: { pcUuid: this.conceptUuid, id: this.rdppRtappMasterId } });
  }
  
  strSubtraction(num1: string, num2: string): number{
    return  Math.abs(Number(num1)-Number(num2));
  }

}
