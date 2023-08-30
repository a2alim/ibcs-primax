import {IIdUuidHolderRequestBody} from '../../../core/models/request';

export interface IFeasibilityModel extends IIdUuidHolderRequestBody {

    titleEn: string;
    titleBn: string;
    sponsoringMinistry: string;
    executingAgency: string;
    dateOfCommencement: Date;
    dateOfCompletion: Date;
    background: string;
    objective: string;
    briefOutlineScope: string;
    output: string;
    needJustification: string;
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
    methodologyOfConductingStudy: string;
    financingArrangement: string;
    projectConceptMasterUuid: string;
    projectConceptMasterId: number;
    paripatraVersionId: number;
    uuid: any;
    id: number;
}
