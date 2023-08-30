import { ExpertEvaluator } from "../../settings/models/expert-evaluator.model";

export class LinkupProposalWithEvaluatorsModel {

    id: number;
    uuid: string;

    researcherProposalId: number;
    stProfileOfExpertEvaluatorsId: number;
    stProfileOfExpertEvaluatorsIdForProMarks: number;
    stProfileOfExpertEvaluatorsIdForResearch: number;
    mailBodyContent: string;
    subject: string;
    mailStatus: number;
    reviewStatus: number;
    isEditable: number;
    viewFlag: boolean;
    emailFor: string;
    mailBodyContentForProMarks: string;
    subjectForProMarks: string;
    mailStatusForProMarks: number;
    reviewStatusForProMarks: number;
    mailBodyContentForResearch: string;
    subjectForResearch: string;
    mailStatusForResearch: number;
    reviewStatusForResearch: number;
    reviewStatusForResearchTemp : number;


}
