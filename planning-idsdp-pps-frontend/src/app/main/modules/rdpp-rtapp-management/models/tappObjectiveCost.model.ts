export class TappObjectiveCostModel {
    id: number;
    uuid: string;

    projectTitleBn: string;
    projectTitleEn: string;
    ministryDivision: string;
    implementingAgency: string;
    concernedDivisionId: any;
    developmentPartnerId: string;
    dateCommencement: string;
    dateCompletion: string;
    objectivesTargets: string;
    designationContactPerson: string;
    responsiblePreparation: string;
    developmentPartner: string;
    projectConceptMasterId: number;
    projectConceptUuid: string;
    tappMasterId: number;
    status: string;

    gobEA: any;
    gobLocal: any;
    gobFe: any;
    gobTotal: any;
    gobSource: string;

    developmentEA: any;
    developmentLocal: any;
    developmentFe: any;
    developmentTotal: any;
    developmentSource: string;

    ownFundEA: any;
    ownFundLocal: any;
    ownFundFe: any;
    ownFundTotal: any;
    ownFundSource: string;

    othersSpecifyEA: any;
    othersSpecifyLocal: any;
    othersSpecifyFe: any;
    othersSpecifyTotal: any;
    othersSpecifySource: string;

    grandTotalEa: any;
    grandTotalLocal: any;
    grandTotalFe: any;
    grandTotalTotal: any;

    currencyRateList: [];
    tappModeFinancingDTO: any;
    devPartnerlist: [];

    sponsoring_ministry_name: string;
    implementing_agency_name: string;
    revisedVersion: string;

    referenceUuid: string;
    referenceId: number;
    timeExtension: boolean;
    costExtension: boolean;
    cumulativeDate : any;

    mainFeaturesOfRevision: string;
}
