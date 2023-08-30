export class TappObjectiveCostModel {
    id: string;
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
    fsUuid: string;
    fsAttachmentId: number;
    fsAttachmentName: string;

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
    modeFinanceList: {
        modeId: number;
        modeSource: string;
        modeSourceVal: string;
        gob: number;
        gobFe: number;
        pa: number;
        paRpa: number;
        ownFund: number;
        ownFundFe: number;
        others: number;
        othersFe: number;
        paSources: string;
        isEdited: boolean
    }[];

    sponsoring_ministry_name: string;
    implementing_agency_name: string;

    sectorId: any;
    subSectorId: any;

}
