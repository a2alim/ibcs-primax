import {IIdUuidHolderRequestBody} from '../../../core/models/request';

export interface IDppLocationWiseCostBreakdown extends IIdUuidHolderRequestBody{

    projectConceptMasterId: number;
    projectConceptMasterUuid: string;
    dppMasterId: number;
    divisionId: string;
    zillaId: string;
    upazilaId: string;
    quantity: string;
    estimatedCost: number;
    comment: string;
}
