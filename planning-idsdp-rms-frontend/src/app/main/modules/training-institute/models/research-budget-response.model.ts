import {ProposalModel} from "./proposal.model";

export class ResearchBudgetResponse {
    createdBy: string;
    createdOn: Date;
    expenditureAmount: number;
    fiscalYearId: number;
    id: number;
    isDeleted: boolean;
    itemOfExpenditureId: number;
    updatedBy: string;
    updatedOn: Date;
    uuid: string;
    proposalId: number;
    ProposalModel: ProposalModel;
}
