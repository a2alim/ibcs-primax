export class ResearchActionModel {

    id:number;
    uuid:string;
    researcherProposalInfoId: number;
    formula:string;
    actionFor: number;
    newResearchStartDate: Date;
    newResearchEndDate: Date;
    newResearchDurationMonth: number;
    newTotalGrantAmount: number;
    subject: string;
    details: string;
    status: string;

}
