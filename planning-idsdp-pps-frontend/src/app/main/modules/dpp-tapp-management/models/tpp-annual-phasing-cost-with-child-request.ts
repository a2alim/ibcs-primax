import {ITppPhasingCostTotal} from './tpp-phasing-cost-total';
import {ITppAnnualPhasingCost} from './tpp-annual-phasing-cost';

export interface ITppAnnualPhasingCostWithChildDetailsRequest extends ITppAnnualPhasingCost {
    fiscalYearsWiseTotal: ITppPhasingCostTotal[];
}
