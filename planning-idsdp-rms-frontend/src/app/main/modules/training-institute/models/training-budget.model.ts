import { ProposalModel } from "./proposal.model";

export class TrainingBudgetModel {
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
    proposalModel: ProposalModel;
    itemOfExpenditureName: string;
    expenditureName: string;
    itemOfExpenditure: string;
    fiscalYear: string;

}
