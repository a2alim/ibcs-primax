import {IIdUuidHolderRequestBody} from '../../../core/models/request';
import {IProjectConceptSummary} from './project-concept-summary';
import {ProjectType} from "../../configuration-management/models/project-type.model";
import {AnnexureAmountModel} from "../../dpp-tapp-management/models/annexure-amount.model";

export interface IProjectConcept extends IIdUuidHolderRequestBody {
    res: any;
    grandTotal: any;
    sponsoringProjectName: string;
    projectCode: string;
    paripatraVersionId: string;
    projectTypeId: number;
    priorityId: string;

    titleEn: string;
    titleBn: string;

    objectivesEn: string;
    objectivesBn: string;

    expCommencementDate: Date;
    expCompletionDate: Date;

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
    sectorDivisionId: number;
    sectorId: number;
    subSectorId: number;
    mainCofogId: number;
    optionalCofogId: number;
    detailsCofogId: number;
    isSelfFund: boolean;
    isForeignAid: boolean;
    agreementNo: string;
    agreementAttachmentId: number;
    projectConceptSummary: IProjectConceptSummary;
    projectTypeDTO: ProjectType;
    agreementAttachmentName: string;

    sponsoringMinistryName: string;
    implementingAgencyName: string;

    sourceModuleType: string;

    createdDate: Date,

    /*---Come from dpp/tapp master table---*/
    projectTitleEn: string;
    projectTitleBn: string;
    dateCommencement: Date;
    dateCompletion: Date;
    /*---/Come from dpp/tapp master table---*/

    userGroup: any;
    agencyDTO: any;
    status: any;
    projectStatus:any;
    agencyId: any;

    annexureAmount: AnnexureAmountModel;

    showAssignMeeting: boolean;
    assingMeeting: boolean;
    assignMeetingButton: boolean;
    pcLinkId: number;

    amsId: number;
    amsCode: String;
    concernedDivisionId: number;

    paripatraVersion: any;
    isParipatra2016: any;
}
