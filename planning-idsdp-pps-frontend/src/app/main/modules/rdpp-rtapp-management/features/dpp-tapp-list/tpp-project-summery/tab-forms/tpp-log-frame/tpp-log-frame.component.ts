import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {locale as lngEnglish} from './i18n/en';
import {locale as lngBangla} from './i18n/bn';
import {ProjectSummaryService} from "../../../../../../project-concept-management/services/project-summary.service";
import { TranslateService } from '@ngx-translate/core';
import { FuseTranslationLoaderService } from 'app/main/core/services/translation-loader.service';
import { RtappAnnualPhasingCostService } from 'app/main/modules/rdpp-rtapp-management/services/rtapp-annual-phasing-cost.service';
import { DppAnnualPhasingConstant } from 'app/main/modules/rdpp-rtapp-management/constants/dpp-annual-phasing.constant';
import { NumberPipe } from 'app/main/shared/pipes/number-pipe.pipe';
import { FiscalYearWiseTotalCost } from 'app/main/modules/rdpp-rtapp-management/models/fiscal-year-wise-total-cost.model';
import { ITppPhasingCostTotal } from 'app/main/modules/rdpp-rtapp-management/models/tpp-phasing-cost-total';
@Component({
    selector: 'app-tpp-log-frame',
    templateUrl: './tpp-log-frame.component.html',
    styleUrls: ['./tpp-log-frame.component.scss']
})
export class TppLogFrameComponent implements OnInit {

    dppMasterId: number;
    projectSummeryId: number;
    conceptUuid: string;
    rtappMasterId: number;
  
    spinner: boolean;
    dppId: number;
  
    currFiscalYearList: { fiscalYear: string }[] = [];
    currRevenueList: { fiscalYear: string, tappAnnualPhasingCostTotal: ITppPhasingCostTotal }[] = [];
    currCapitalList: { fiscalYear: string, tappAnnualPhasingCostTotal: ITppPhasingCostTotal }[] = [];
    currContingencyList: { fiscalYear: string, tappAnnualPhasingCostTotal: ITppPhasingCostTotal }[] = [];
    currPhysicalContingencyList: { fiscalYear: string, tappAnnualPhasingCostTotal: ITppPhasingCostTotal }[] = [];
    currPriceContingencyList: { fiscalYear: string, tappAnnualPhasingCostTotal: ITppPhasingCostTotal }[] = [];
    currGrandTotalList: { fiscalYear: string, tappAnnualPhasingCostTotal: ITppPhasingCostTotal }[] = [];
  
    refFiscalYearList: { fiscalYear: string }[] = [];
    refRevenueList: { fiscalYear: string, tappAnnualPhasingCostTotal: ITppPhasingCostTotal }[] = [];
    refCapitalList: { fiscalYear: string, tappAnnualPhasingCostTotal: ITppPhasingCostTotal }[] = [];
    refContingencyList: { fiscalYear: string, tappAnnualPhasingCostTotal: ITppPhasingCostTotal }[] = [];
    refPhysicalContingencyList: { fiscalYear: string, tappAnnualPhasingCostTotal: ITppPhasingCostTotal }[] = [];
    refPriceContingencyList: { fiscalYear: string, tappAnnualPhasingCostTotal: ITppPhasingCostTotal }[] = [];
    refGrandTotalList: { fiscalYear: string, tappAnnualPhasingCostTotal: ITppPhasingCostTotal }[] = [];
  
    refRevenueItems: ITppPhasingCostTotal[] = [];
    currRevenueItems: ITppPhasingCostTotal[] = [];
    refCapitalItems: ITppPhasingCostTotal[] = [];
    currCapitalItems: ITppPhasingCostTotal[] = [];
  
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
      private rtappAnnualPhasingCostService: RtappAnnualPhasingCostService,
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
        this.rtappMasterId = params['id'];
      });
      this.getRdppGrandTotalByMasterId();
    }
  
    private getRdppGrandTotalByMasterId() {
      this.spinner = true;
      this.rtappAnnualPhasingCostService.getRdppGrandTotalByMasterId(this.rtappMasterId).subscribe(
        res => {
          console.log('res ===> ', res);

          this.arrangeCurrentGrandTotalList(res.currentGrandTotal);
          this.arrangeReferenceGrandTotalList(res.referenceGrandTotal);
  
          if (res && res.referenceItemWiseRevenue && res.referenceItemWiseRevenue.tappAnnualPhasingCostTabDetails.length>0) {
            this.refRevenueItems = res.referenceItemWiseRevenue.tappAnnualPhasingCostTabDetails;
            this.refRevenueItemGTObj = res.referenceItemWiseRevenue.tappAnnualPhasingCostTotal;
          }
          if (res && res.currentItemWiseRevenue && res.currentItemWiseRevenue.tappAnnualPhasingCostTabDetails.length > 0) {
            this.currRevenueItems = res.currentItemWiseRevenue.tappAnnualPhasingCostTabDetails
            this.currRevenueItemGTObj = res.currentItemWiseRevenue.tappAnnualPhasingCostTotal;
          }
  
          if (res && res.referenceItemWiseCapital && res.referenceItemWiseCapital.tappAnnualPhasingCostTabDetails.length > 0) {
            this.refCapitalItems = res.referenceItemWiseCapital.tappAnnualPhasingCostTabDetails
            this.refCapitalItemGTObj = res.referenceItemWiseCapital.tappAnnualPhasingCostTotal;
          }
          if (res && res.currentItemWiseCapital && res.currentItemWiseCapital.tappAnnualPhasingCostTabDetails.length>0) {
            this.currCapitalItems = res.currentItemWiseCapital.tappAnnualPhasingCostTabDetails;
            this.currCapitalItemGTObj = res.currentItemWiseCapital.tappAnnualPhasingCostTotal;
          }
          this.calculateYearWiseGrandTotal();
        }, 
        error => {
            console.log('getRdppGrandTotalByMasterId : ',error);
            this.spinner = false;
        }
      );
    }
  
    arrangeCurrentGrandTotalList(currentGrandTotal){
      if (currentGrandTotal.length > 1) {
        this.currFiscalYearList = currentGrandTotal.filter(f => f.componentName === DppAnnualPhasingConstant.Revenue_Component)[0]?.grandTotal.map(m => ({ fiscalYear: m.fiscalYear }));
        
        if(currentGrandTotal.filter(f => f.componentName === DppAnnualPhasingConstant.Revenue_Component).length>0){
          this.currRevenueList = currentGrandTotal.filter(f => f.componentName === DppAnnualPhasingConstant.Revenue_Component)[0]?.grandTotal;
          let cumulativeCost = {
            fiscalYear: '',
            tappAnnualPhasingCostTotal: currentGrandTotal.filter(f => f.componentName === DppAnnualPhasingConstant.Revenue_Component)[0]?.tappAnnualPhasingCostTotal[0]
          };
          this.currRevenueList.push(cumulativeCost);
          this.currFiscalYearList.push(cumulativeCost);
        }
  
        if(currentGrandTotal.filter(f => f.componentName === DppAnnualPhasingConstant.Capital_Component).length > 0){
          this.currCapitalList = currentGrandTotal.filter(f => f.componentName === DppAnnualPhasingConstant.Capital_Component)[0].grandTotal;
          let cumulativeCost = {
            fiscalYear: '',
            tappAnnualPhasingCostTotal: currentGrandTotal.filter(f => f.componentName === DppAnnualPhasingConstant.Capital_Component)[0]?.tappAnnualPhasingCostTotal[0]
          };
          this.currCapitalList.push(cumulativeCost);
        }
        
        if(currentGrandTotal.filter(f => f.componentName === DppAnnualPhasingConstant.Contingency).length > 0){
          this.currContingencyList = currentGrandTotal.filter(f => f.componentName === DppAnnualPhasingConstant.Contingency)[0]?.grandTotal;
          let physicalContingencyCumulativeCost = {
            fiscalYear: '',
            tappAnnualPhasingCostTotal: currentGrandTotal.filter(f => f.componentName === DppAnnualPhasingConstant.Contingency)[0]?.tappAnnualPhasingCostTotal[0]
          };
          this.currPhysicalContingencyList.push(physicalContingencyCumulativeCost);
          let priceContingencyCumulativeCost = {
            fiscalYear: '',
            tappAnnualPhasingCostTotal: currentGrandTotal.filter(f => f.componentName === DppAnnualPhasingConstant.Contingency)[0]?.tappAnnualPhasingCostTotal[1]
          };
          this.currPriceContingencyList.push(priceContingencyCumulativeCost);
        }
        
        if(currentGrandTotal.filter(f => f.componentName === DppAnnualPhasingConstant.Grand_Total).length>0){
          this.currGrandTotalList = currentGrandTotal.filter(f => f.componentName === DppAnnualPhasingConstant.Grand_Total)[0]?.grandTotal;
          let cumulativeCost = {
            fiscalYear: '',
            tappAnnualPhasingCostTotal: currentGrandTotal.filter(f => f.componentName === DppAnnualPhasingConstant.Grand_Total)[0]?.tappAnnualPhasingCostTotal[0]
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
        this.refFiscalYearList = referenceGrandTotal.filter(f => f.componentName === DppAnnualPhasingConstant.Revenue_Component)[0]?.grandTotal.map(m => ({ fiscalYear: m.fiscalYear }));
        this.refRevenueList = referenceGrandTotal.filter(f => f.componentName === DppAnnualPhasingConstant.Revenue_Component).length > 0 ?
          referenceGrandTotal.filter(f => f.componentName === DppAnnualPhasingConstant.Revenue_Component)[0]?.grandTotal : [];
        this.refCapitalList = referenceGrandTotal.filter(f => f.componentName === DppAnnualPhasingConstant.Capital_Component).length > 0 ?
          referenceGrandTotal.filter(f => f.componentName === DppAnnualPhasingConstant.Capital_Component)[0].grandTotal : [];
        this.refContingencyList = referenceGrandTotal.filter(f => f.componentName === DppAnnualPhasingConstant.Contingency).length > 0 ?
          referenceGrandTotal.filter(f => f.componentName === DppAnnualPhasingConstant.Contingency)[0]?.grandTotal : [];
        this.refGrandTotalList = referenceGrandTotal.filter(f => f.componentName === DppAnnualPhasingConstant.Grand_Total) ?
          referenceGrandTotal.filter(f => f.componentName === DppAnnualPhasingConstant.Grand_Total)[0]?.grandTotal : [];
  
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
        dataObj.fiscalYear += fromList[index]?.tappAnnualPhasingCostTotal?.fiscalYear + ', ';
        dataObj.qty += fromList[index]?.tappAnnualPhasingCostTotal?.qty;
        dataObj.totalAmount += fromList[index]?.tappAnnualPhasingCostTotal?.totalAmount;
        dataObj.gobAmount += fromList[index]?.tappAnnualPhasingCostTotal?.gobAmount;
        dataObj.gobFeAmount += fromList[index]?.tappAnnualPhasingCostTotal?.gobFeAmount;
        dataObj.gobThruAmount += fromList[index]?.tappAnnualPhasingCostTotal?.gobThruAmount;
        dataObj.spAcAmount += fromList[index]?.tappAnnualPhasingCostTotal?.spAcAmount;
        dataObj.thruPdAmount += fromList[index]?.tappAnnualPhasingCostTotal?.thruPdAmount;
        dataObj.thruDpAmount += fromList[index]?.tappAnnualPhasingCostTotal?.thruDpAmount;
        dataObj.ownFundAmount += fromList[index]?.tappAnnualPhasingCostTotal?.ownFundAmount;
        dataObj.ownFundFeAmount += fromList[index]?.tappAnnualPhasingCostTotal?.ownFundFeAmount;
        dataObj.otherAmount += fromList[index]?.tappAnnualPhasingCostTotal?.otherAmount;
        dataObj.otherFeAmount += fromList[index]?.tappAnnualPhasingCostTotal?.otherFeAmount;
      }
    }
  
    strSubtraction(num1: string, num2: string): number{
      return  Math.abs(Number(num1)-Number(num2));
    }
  
}
