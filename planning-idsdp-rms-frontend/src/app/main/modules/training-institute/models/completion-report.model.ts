import {ProposalModel} from "./proposal.model";

export class CompletionReportModel {
    background: string;
    onlineAssessment: string;
    percentageOfAttendance: string;
    proposalId: number;
    remarks: string;
    workshopObjectives: string;
    proposalModel: ProposalModel;
    isFinalSubmitted: boolean = false;
}
