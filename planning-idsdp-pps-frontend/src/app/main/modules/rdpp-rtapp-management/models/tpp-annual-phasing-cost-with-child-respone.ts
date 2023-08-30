import {IFiscalYearRequest} from './fiscal-year-request';
import {ITppPhasingCostTotal} from './tpp-phasing-cost-total';
import {ITppAnnualPhasingCost} from './tpp-annual-phasing-cost';

export interface RTppAnnualPhasingCostWithChildDetailsResponse extends ITppAnnualPhasingCost {
    fiscalYearWiseCost:
        {
            fiscalYear: string,
            values: IFiscalYearRequest[],
            tappAnnualPhasingCostTotal: ITppPhasingCostTotal
        }[]
}
