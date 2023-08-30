import {IIdUuidHolderRequestBody} from '../../../core/models/request';
import {IFiscalYearRequest} from './fiscal-year-request';

export interface IDppAnnualPhasingEstimatedCostTabDetails extends IIdUuidHolderRequestBody{
    attachmentId: number,
    description: string,
    economicCode: null
    gobAmount: number,
    gobFeAmount: number,
    gobThruAmount: any,
    id: any,
    isMajor: any,
    otherAmount: any,
    otherFeAmount: number,
    ownFundAmount: any,
    ownFundFeAmount: number,
    qty: any,
    spAcAmount: any,
    subEconomicCode: any,
    thruDpAmount: any,
    thruPdAmount: any,
    totalAmount: any,
    totalCostCalculated: number,
    totalProjectCost: number,
    unitCost: Number,
    unitType: any,
    uuid: any,

}
