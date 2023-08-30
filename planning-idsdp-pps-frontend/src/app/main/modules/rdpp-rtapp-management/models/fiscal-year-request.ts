import {IIdUuidHolderRequestBody} from '../../../core/models/request';
import {IDppPhasingCostTotal} from './dpp-phasing-cost-total';

export interface IFiscalYearRequest extends IIdUuidHolderRequestBody{
    fiscalYear: string,
    quantity: number;
    gobAmount: number,
    gobFeAmount: number,
    gobThruAmount: number,
    spAcAmount: number,
    thruPdAmount: number,
    thruDpAmount: number,
    ownFundAmount: number,
    ownFundFeAmount: number,
    otherAmount: number,
    otherFeAmount: number,
    totalAmount: number,
    dppAnnualPhasingCostTotal?: IDppPhasingCostTotal;
}
