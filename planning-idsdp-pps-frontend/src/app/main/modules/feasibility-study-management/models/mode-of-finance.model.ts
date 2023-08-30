import {IIdUuidHolderRequestBody} from '../../../core/models/request';

export interface ModeOfFinanceModel extends IIdUuidHolderRequestBody {
    modeFinId: number;
    totalAmount: number;
    gobAmount: number;
    feGobAmount: number;
    ownFundAmount: number;
    feOwnFundAmount: number;
    paAmount: number;
    rpaAmount: number;
    dpaAmount: number;
    otherAmount: number;
    feOtherAmount: number;
    paSourceId: number;
    fspMasterId: number;

}
