import { Component, EventEmitter, Inject, OnInit, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { DppAnnualPhasingCostService } from "../../../../../services/dpp-annual-phasing-cost.service";
import { DppAnnualPhasingConstant } from "../../../../../constants/dpp-annual-phasing.constant";
import { CalFinancialAnalysis } from '../../models/cal-financial-analysis.model';
import { CalFinancialAnalysisParent } from '../../models/cal-financial-analysis-parent.model';
import { FinancialAnalysisService } from '../../services/financial-analysis.service';
import { SnackbarHelper } from 'app/main/core/helper/snackbar.helper';

@Component({
    selector: 'app-financial-analysis-cal-modal',
    templateUrl: './financial-analysis-cal-modal.component.html',
    styleUrls: ['./financial-analysis-cal-modal.component.scss']
})
export class FinancialAnalysisCalModalComponent implements OnInit {

    closeEventEmitter: EventEmitter<any> = new EventEmitter<any>();
    financialAnalysisObj: CalFinancialAnalysisParent = new CalFinancialAnalysisParent();

    isProjectLifeTimeDisabled: boolean = false;
    spinner: boolean;

    grandTotalObj: any = {
        totalCapitalCost: 0,
        totalOperatingCost: 0,
        totalTotalCost: 0,
        totalDiscValueOfTotalCost1: 0,
        totalBenifit1: 0,
        totalDiscValueOfBenifit1: 0,
        totalDiscValueOfTotalCost2: 0,
        totalBenifit2: 0,
        totalDiscValueOfBenifit2: 0,
    }

    constructor(
        private dialog: MatDialog,
        private annualPhasingCostService: DppAnnualPhasingCostService,
        private financialAnalysisService: FinancialAnalysisService,
        private snackbarHelper: SnackbarHelper,
        @Optional() @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.financialAnalysisObj.projectConceptMasterId = data.projectConceptMasterId;
        this.financialAnalysisObj.calculationType = data.calculationType;
    }

    ngOnInit(): void {
        this.getByProjectConceptMasterId(this.financialAnalysisObj.projectConceptMasterId, this.financialAnalysisObj.calculationType)
    }

    getConstructionYearTotal() {
        this.annualPhasingCostService.getGrandTotalByProjectConceptId(this.financialAnalysisObj.projectConceptMasterId).subscribe(
            res => {
                const grantTotalList = res.filter(f => f.dppAnnualPhasing === DppAnnualPhasingConstant.Grand_Total)[0]?.grandTotal;
                grantTotalList.forEach(element => {
                    let calFinancialAnalysisObj = new CalFinancialAnalysis();
                    calFinancialAnalysisObj.fiscalYear = element.fiscalYear;
                    calFinancialAnalysisObj.noOfFiscalYear = 0;
                    calFinancialAnalysisObj.capitalCost = element.dppAnnualPhasingCostTotal.totalAmount;
                    calFinancialAnalysisObj.totalCost = element.dppAnnualPhasingCostTotal.totalAmount;
                    this.financialAnalysisObj.financialAnalysisList.push(calFinancialAnalysisObj);
                });
                this.calGrandTotal();
            }
        )
    }

    calTotalCost(data) {
        data.totalCost = Number(data.capitalCost) + Number(data.operatingCost);
        this.calDiscValueOfTotalCost1(data);
        this.calDiscValueOfBenifit1(data)
        this.calDiscValueOfTotalCost2(data);
        this.calDiscValueOfBenifit2(data)
        this.calGrandTotal();
    }

    calDiscValueOfTotalCost1(data) {
        data.discValueOfTotalCost1 = (1 / (Math.pow((1 + (this.financialAnalysisObj.discFac1 / 100)), data.noOfFiscalYear)) * data.totalCost);
        data.discValueOfTotalCost1 = data.discValueOfTotalCost1 ? data.discValueOfTotalCost1 : 0;
        this.calGrandTotal();
    }

    calDiscValueOfBenifit1(data) {
        data.discValueOfBenifit1 = (1 / (Math.pow((1 + (this.financialAnalysisObj.discFac1 / 100)), data.noOfFiscalYear)) * data.benifit1);
        data.discValueOfBenifit1 = data.discValueOfBenifit1 ? data.discValueOfBenifit1 : 0;
        this.calGrandTotal();
    }

    calDiscValueOfTotalCost2(data) {
        data.discValueOfTotalCost2 = (1 / (Math.pow((1 + (this.financialAnalysisObj.discFac2 / 100)), data.noOfFiscalYear)) * data.totalCost);
        data.discValueOfTotalCost2 = data.discValueOfTotalCost2 ? data.discValueOfTotalCost2 : 0;
        this.calGrandTotal();
    }

    calDiscValueOfBenifit2(data) {
        data.discValueOfBenifit2 = (1 / (Math.pow((1 + (this.financialAnalysisObj.discFac2 / 100)), data.noOfFiscalYear)) * data.benifit2);
        data.discValueOfBenifit2 = data.discValueOfBenifit2 ? data.discValueOfBenifit2 : 0;
        this.calGrandTotal();
    }

    onChangeDiscFactor1() {
        this.financialAnalysisObj.financialAnalysisList.forEach(data => {
            this.calDiscValueOfTotalCost1(data);
            this.calDiscValueOfBenifit1(data);
        });
        this.calGrandTotal();
        document.getElementById('disFacter2').focus();
    }

    onChangeDiscFactor2() {
        this.financialAnalysisObj.financialAnalysisList.forEach(data => {
            this.calDiscValueOfTotalCost2(data);
            this.calDiscValueOfBenifit2(data);
        });
        this.calGrandTotal();
    }

    calGrandTotal() {
        this.grandTotalObj = {
            totalCapitalCost: 0,
            totalOperatingCost: 0,
            totalTotalCost: 0,
            totalDiscValueOfTotalCost1: 0,
            totalBenifit1: 0,
            totalDiscValueOfBenifit1: 0,
            totalDiscValueOfTotalCost2: 0,
            totalBenifit2: 0,
            totalDiscValueOfBenifit2: 0,
        }
        this.financialAnalysisObj.financialAnalysisList.forEach(data => {
            this.grandTotalObj.totalCapitalCost += data.capitalCost;
            this.grandTotalObj.totalOperatingCost += data.operatingCost;
            this.grandTotalObj.totalTotalCost += data.totalCost;

            this.grandTotalObj.totalDiscValueOfTotalCost1 += data.discValueOfTotalCost1;
            this.grandTotalObj.totalBenifit1 += data.benifit1;
            this.grandTotalObj.totalDiscValueOfBenifit1 += data.discValueOfBenifit1;

            this.grandTotalObj.totalDiscValueOfTotalCost2 += data.discValueOfTotalCost2;
            this.grandTotalObj.totalBenifit2 += data.benifit2;
            this.grandTotalObj.totalDiscValueOfBenifit2 += data.discValueOfBenifit2;
        });
    }

    closeDialog(data: any) {
        this.closeEventEmitter.next(data ? data : new CalFinancialAnalysisParent());
        this.dialog.closeAll();
    }

    onClickProjectLifeTime() {
        let isDataIndex: any;
        this.financialAnalysisObj.financialAnalysisList.forEach((element, index) => {
            if (element.noOfFiscalYear == 1) {
                isDataIndex = index;
                return;
            }
        });
        if (isDataIndex) {
            this.financialAnalysisObj.financialAnalysisList.splice(isDataIndex);
        }

        for (let i = 0; i < this.financialAnalysisObj.projectLifeTime; i++) {
            let obj = new CalFinancialAnalysis();
            obj.fiscalYear = (i + 1);
            obj.noOfFiscalYear = (i + 1);
            this.financialAnalysisObj.financialAnalysisList.push(obj);
        }
        this.isProjectLifeTimeDisabled = true;
        document.getElementById('disFacter1').focus();
        this.calGrandTotal();
    }

    addNewRow() {
        let obj = new CalFinancialAnalysis();
        let lastIndex = this.financialAnalysisObj.financialAnalysisList.length - 1;
        obj.fiscalYear = this.financialAnalysisObj.financialAnalysisList[lastIndex].noOfFiscalYear + 1;
        obj.noOfFiscalYear = this.financialAnalysisObj.financialAnalysisList[lastIndex].noOfFiscalYear + 1;

        this.financialAnalysisObj.financialAnalysisList.push(obj);
        this.financialAnalysisObj.projectLifeTime++;
    }

    onClickCancle(index) {
        this.financialAnalysisObj.financialAnalysisList.splice(index, 1);
        this.financialAnalysisObj.projectLifeTime--;
        this.calGrandTotal();
    }

    onClickClalulate() {
        this.financialAnalysisObj.discFac1Npv = 0;
        this.financialAnalysisObj.discFac1Bcr = 0;
        this.financialAnalysisObj.discFac1Irr = 0;
        this.financialAnalysisObj.discFac2Npv = 0;
        this.financialAnalysisObj.discFac2Bcr = 0;
        this.financialAnalysisObj.discFac2Irr = 0;

        this.financialAnalysisObj.discFac1Npv = this.grandTotalObj.totalDiscValueOfBenifit1 - this.grandTotalObj.totalDiscValueOfTotalCost1;
        this.financialAnalysisObj.discFac1Bcr = this.grandTotalObj.totalDiscValueOfBenifit1 / this.grandTotalObj.totalDiscValueOfTotalCost1;
        this.financialAnalysisObj.discFac1Irr = this.financialAnalysisObj.discFac1 + (this.grandTotalObj.totalDiscValueOfBenifit1 / (this.grandTotalObj.totalDiscValueOfTotalCost1 + this.grandTotalObj.totalDiscValueOfTotalCost2)) * Math.abs(this.financialAnalysisObj.discFac2 - this.financialAnalysisObj.discFac1)

        this.financialAnalysisObj.discFac2Npv = this.grandTotalObj.totalDiscValueOfBenifit2 - this.grandTotalObj.totalDiscValueOfTotalCost2;
        this.financialAnalysisObj.discFac2Bcr = this.grandTotalObj.totalDiscValueOfBenifit2 / this.grandTotalObj.totalDiscValueOfTotalCost2;
        this.financialAnalysisObj.discFac2Irr = this.financialAnalysisObj.discFac2 + (this.grandTotalObj.totalDiscValueOfBenifit2 / (this.grandTotalObj.totalDiscValueOfTotalCost1 + this.grandTotalObj.totalDiscValueOfTotalCost2)) * Math.abs(this.financialAnalysisObj.discFac2 - this.financialAnalysisObj.discFac1);
    }

    create() {

        if (!this.financialAnalysisObj.isSelectDiscFactor1 && !this.financialAnalysisObj.isSelectDiscFactor2) {
            return this.snackbarHelper.openWarnSnackBarWithMessage('Please Select Discounting Factor', 'OK');
        }
        this.spinner = true;
        this.financialAnalysisService.saveFinancialAnalysisCalculation(this.financialAnalysisObj).subscribe(
            res => {
                if (res.status == 200) {
                    this.snackbarHelper.openSuccessSnackBarWithMessage(res.message, 'OK');
                    this.closeDialog(res.res);
                } else {
                    this.snackbarHelper.openWarnSnackBarWithMessage(res.message, 'OK');
                }
                this.spinner = false;
            },
            err => {
                this.spinner = false;
            }
        )
    }

    getByProjectConceptMasterId(projectConceptMasterId, calculationType) {

        this.financialAnalysisService.getByProjectConceptMasterId(projectConceptMasterId, calculationType).subscribe(
            res => {

                if (res.status == 200) {
                    this.financialAnalysisObj = res.res;
                    this.calGrandTotal();
                } else {
                    this.getConstructionYearTotal();
                }
            },
            err => {
            }
        );
    }


}
