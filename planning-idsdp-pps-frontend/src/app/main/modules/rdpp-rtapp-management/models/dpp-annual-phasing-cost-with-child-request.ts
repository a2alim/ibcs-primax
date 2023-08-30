import {IDppAnnualPhasingCost} from './dpp-annual-phasing-cost';
import {IDppPhasingCostTotal} from './dpp-phasing-cost-total';

export interface IDppAnnualPhasingCostWithChildDetailsRequest extends IDppAnnualPhasingCost {
    fiscalYearsWiseTotal: IDppPhasingCostTotal[];
}
