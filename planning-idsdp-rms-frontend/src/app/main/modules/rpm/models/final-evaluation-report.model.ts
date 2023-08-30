export class FinalEvaluationReportModel {

    id: number;
    uuid: string;
    m1ResearcherProposalInfoId: number;
    researchObjectives: string;
    describeProblem: string;
    note: string;
    isResearchRulesAreFollowed: boolean;
    isEditable: boolean;
    isActive: boolean = true;

}