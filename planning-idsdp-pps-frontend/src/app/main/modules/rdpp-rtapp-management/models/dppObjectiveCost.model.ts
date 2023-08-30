import {IDppPhasingCostTotal} from "./dpp-phasing-cost-total";

export class DppObjectiveCostModel {
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
    paripatraVersionId: number;
    dppMasterId: any;
    modeFinanceList:any;
    responsiblePreparation: string;
    designationContactPerson: string;
    revisedVersion: string;
    revisedVersionBn: string;

    referenceId: number;
    concernedDivisionName: string;
    referenceUuid: string;
    IDppPhasingCostTotal: IDppPhasingCostTotal;
    timeExtension: boolean;
    costExtension: boolean;
    cumulativeDate: any;


   // dppModeOfFinancing: any;
   // currencyRateList: DppCurrencyRateModel[] = new Array<DppCurrencyRateModel>();
}
