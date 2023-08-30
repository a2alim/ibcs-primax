import { MtbfFiscalYearDetailsListModel } from "./mtbf-fiscal-year-details-list-model.model";

export class MtbfModel {
    id: string;
    uuid: string;
    projectConceptId: number;
    projectConceptUuid: string;
    numberOfOngoingProject: string;
    costOfApprovedProject: string;
    cumulativeExpenditure: string;
    allocationRequiredForOngoingProject: string;
    allocationInCurrentFiscalYear: string;
    numberOfApprovedProject: string;
    numberOfRecommendedProject: string;
    wayOfFinancing: string;
    
    mtbfFiscalYearDetailsListModel : MtbfFiscalYearDetailsListModel [];
 

}
