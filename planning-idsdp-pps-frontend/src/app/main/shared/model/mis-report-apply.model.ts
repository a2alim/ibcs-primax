import {PageableDtoModel} from "./pageable-dto.model";

export class MisReportApplyModel {
    sectorDivisionId: any;
    sectorId: any;
    subSectorIid: any;
    projectTypeId: any;
    paAmountFrom: any;
    paAmountTo: any;
    gobAmountFrom: any;
    gobAmountTo: any;
    ownAmountFrom: any;
    ownAmountTo: any;
    totalAmountFrom: any;
    totalAmountTo: any;
    isFundingTypeGob: false;
    isFundingTypeOwn: false;
    isFundingTypeOther: false;
    isFinancingTypeGob: false;
    isFinancingTypePa: false;
    ministryName: string;
    agencyName: string;
    fiscalYearFrom: any;
    fiscalYearTo: any;
    divisionLocationId:any;
    zillaLocationId: any;
    upazilaLocationId: any;
    page: any;
    size : any;
}
