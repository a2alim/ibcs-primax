
export class MisReportModel {
    projectConceptId: number;
     projectConceptUuid :  string;
     dppTappMasterId : number;
     dppTappMasterUuid :  string;
     projectTitleEn :  string;
     projectTitleBn :  string;
     ministryDivision :  string;
     implementingAgency :  string;
     commencementDate :  Date;
     completionDate :  Date;
     createdDate :  Date;
     movementStatus :  string;
     ppsCode :  string;
    projectType: {
        "id": number;
        "code": string;
        "projectTypeCode": string;
        "nameEn": string;
        "nameBn": string;
        "description": string;
        "status": boolean;
    };
    sectorDivision: {
        "id": number;
        "uuid": string;
        "code": string;
        "sectorDivisionCode": string;
        "sectorDivisionNameEn": string;
        "sectorDivisionNameBn": string;
        "description": string;
        "status": boolean;
    };
    annexureAmount: {
        "totalAmount": number;
        "gobAmount": number;
        "gobFeAmount": number;
        "paAmount": number;
        "rpaAmount": number;
        "ownFundAmount": number;
        "ownFundFeAmount": number;
        "otherAmount": number;
        "otherFeAmount": number;
    }
}
