export class AdpFundReqModel {

    id: number;
    uuid: string;
    dppTappMasterId: number;
    dppTappMasterUuid: string;
    projectConceptMasterId: number;
    projectConceptUuid: number;

    sector: string;
    subSector: string;
    fiscalYear: string;
    periodFrom: string;
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

    allocationForTax: number;
    projectAidCost: number;
    projectAidTk: number;
    other: number;


}