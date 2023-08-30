export class ResearcherProposalActionPlan {
    id: number;
    //researcherProposal:any;
    proposalActionPlanId:number;   
    uuid: string;
    researcherProposalId: number;
    catWiseActPlanId:number;
    taskName: string;
    startDate: Date;
    endDate: Date;
    remarks: string;    
    isDeleted: 1 | 0;
    isAgree:true | false;
    totalDays:0;   
}
