export class AdpFundReqModel {

    sector: string;
    subSector: string;
    fiscalYear: string;
    periodForm: string;
    periodTo: string;
    cumulativeExpenditureUpTo: Date;
    formType: string;

    projectTitle: string;
    projectExecutionPeriod: string;
    approvalStage: string;
    totalProjectExp: number;
    totalProjectAid: number;
    totalRevisedAllowcation: number;
    revisedAllowcationTk: number;
    totalActualCost: number;
    actualCostTk: number;
    totalCumulativeCost: number;
    cumulativeCostTk: number;

    totalProposedAllocation: number;
    proposedAllocationTk: number;
    proposedAllocationRevenue: number;

    expSectorCapital: number;
    expSectorTk: number;
    expSectorRevenue: number;

    allocationForAax: number;
    projectAidCost: number;
    projectAidTk: number;
    other: number;


}