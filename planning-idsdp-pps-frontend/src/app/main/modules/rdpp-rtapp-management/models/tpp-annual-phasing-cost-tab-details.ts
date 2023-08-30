import {IIdUuidHolderRequestBody} from '../../../core/models/request';
import {IFiscalYearRequest} from './fiscal-year-request';

export interface ITppAnnualPhasingCostTabDetails extends IIdUuidHolderRequestBody{

    // tappAnnualPhasingCostId: number,
    attachmentId: number,
    economicCodeId: number,
    subEconomicCodeId: number,
    description: string,
    unitId: number,
    unitCost: number,
    qty: number,
    totalAmount: number,
    otherFe: number,
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
    isFromOriginal: boolean,
    fiscalYears?: IFiscalYearRequest[];

}
