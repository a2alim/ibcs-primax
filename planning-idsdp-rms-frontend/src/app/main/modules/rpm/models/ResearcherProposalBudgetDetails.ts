export class ResearcherProposalBudgetDetails {

    id: number;
    uuid: string;
    researcherProposalId: number;
    stExpenditureItemId: any;
    purpose: string;
    totalAmount: number;
    isEditable: 1 | 0;
    isDeleted: 1 | 0;
    expenditureName: string;
    expenditureItem?: any;
    showExpenditureItem: boolean;

}
