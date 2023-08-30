export class AgreementWithResearcherModel {
    id : number;
    uuid:string;
    infoId: number;
    totalGrantAmount: number;
    installmentNo: number;
    createdOn:Date;
    researchStartDate: Date;
    researchEndDate: Date;
    researchDuration: string;
    firstPage: string;
    secondPage: string;
    thirdPage: string;
    fourthPage: string;
    recipientUserId: number;
    isEditable: boolean = true;
    researcherProposalId : any;
}
