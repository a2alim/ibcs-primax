import {IFiscalYearRequest} from './fiscal-year-request';
import {IDppAnnualPhasingCost} from './dpp-annual-phasing-cost';
import {IDppPhasingCostTotal} from './dpp-phasing-cost-total';

export interface IDppAnnualPhasingCostWithChildDetailsResponse extends IDppAnnualPhasingCost {
    fiscalYearWiseCost:
        {
            fiscalYear: string,
            values: IFiscalYearRequest[],
            dppAnnualPhasingCostTotal: IDppPhasingCostTotal
        }[]
}
