import {IDppPhasingCostTotal} from "./dpp-phasing-cost-total";
import {IDppAnnualPhasingCostWithChildDetailsResponse} from "./dpp-annual-phasing-cost-with-child-respone";
import {IFiscalYearRequest} from "./fiscal-year-request";
import {IDppAnnualPhasingCostTabDetails} from "./dpp-annual-phasing-cost-tab-details";
import {DppAnnualPhasingCostTabDetailsWithName} from "./dpp-annual-phasing-cost-tab-details-with-name.model";

export class ItemWiseCumulativeProgress{

    /** For Grand Total */
    /*capitalTotal: IDppPhasingCostTotal;
    grandTotal: { dppAnnualPhasing: string, dppAnnualPhasingCostTotal: IDppPhasingCostTotal[], grandTotal: { fiscalYear: string, dppAnnualPhasingCostTotal: IDppPhasingCostTotal } [] }[] = [];
    contingencyTotal: IDppPhasingCostTotal[];
    grantTotal: IDppPhasingCostTotal;
    revenueList: { fiscalYear: string, dppAnnualPhasingCostTotal: IDppPhasingCostTotal } [] = [];
    capitalList: { fiscalYear: string, dppAnnualPhasingCostTotal: IDppPhasingCostTotal } [] = [];
    contingencyList: { fiscalYear: string, dppAnnualPhasingCostTotal: IDppPhasingCostTotal } [] = [];
    grandList: { fiscalYear: string, dppAnnualPhasingCostTotal: IDppPhasingCostTotal } [] = [];
    physicalContingencyList: { fiscalYear: string, dppAnnualPhasingCostTotal: IDppPhasingCostTotal } [] = [];
    priceContingencyList: { fiscalYear: string, dppAnnualPhasingCostTotal: IDppPhasingCostTotal } [] = [];*/

    /** For Every component wise */
    dppAnnualPhasingCostWithChildDetails: IDppAnnualPhasingCostWithChildDetailsResponse;
    fiscalYearWiseCost: DppAnnualPhasingCostTabDetailsWithName [] = [];
    // revenueSubTotal: IDppPhasingCostTotal;
    // fiscalYearWiseCost: { fiscalYear: string, values: IFiscalYearRequest[], dppAnnualPhasingCostTotal?: IDppPhasingCostTotal }[] = [];
    // fiscalYearList: { fiscalYear: string }[] = [];

}
