import {IIdUuidHolderRequestBody} from '../../../core/models/request';
import {IFiscalYearRequest} from './fiscal-year-request';

export interface IDppPhasingCostTotal extends IIdUuidHolderRequestBody {
    fiscalYear?: string;
    qty?: number,
    totalAmount: number,
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








}
