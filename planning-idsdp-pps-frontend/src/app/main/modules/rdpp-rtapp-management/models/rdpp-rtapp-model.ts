export class RdppRtappModel {
    id: number;
    uuid: string;
    status: string;
    projectTitleEn: string;
    projectTitleBn: string;
    ministryDivision: string;
    implementingAgency: string;
    objectivesTargets: string;
    concernedDivisionId: any;
    developmentPartnerId: number;
    dateCommencement: any;
    dateCompletion: any;
    projectConceptUuid: string;
    projectConceptMasterId: number;
    dppMasterId: any;
    responsiblePreparation: string;
    designationContactPerson: string;
    cumulativeDate: any;

    developmentPartnersList = [];
    modeFinanceList = [];
    currencyRateList = [];

    timeExtension: boolean;
    costExtension: boolean;
    version: string;

    referenceId: number;
    referenceUuid: string;
}
