import {ResearcherPresentation} from "./ResearcherPresentation";
import {ResearcherProposal} from "./ResearcherProposal";
import {NewMember} from "./NewMember";
import {ExpertEvaluator} from "../../settings/models/expert-evaluator.model";
import {PresentationReport} from "./PresentationReport";

export class PresentationEvaluatorsFeedback {

    id: number;
    uuid: string;
    m2ResearcherPresentationId: number;
    m1ResearcherProposalId: number;
    researcherUserId: number;
    stProfileOfExpertEvaluatorsId: number;
    m2AddNewMemberId: number;
    isPresent: boolean;
    evaluatorFeedback: string;
    pageNo1: number;
    researcherFeedback: string;
    pageNo2: number;
    feedbackCompleted: boolean;
    isResearcherVisible: boolean;
    isNew: boolean;
    isVisible: boolean;
    isEditable: boolean;
    type: string;

    researcherPresentationResponseDto: ResearcherPresentation;
    researcherProposalResponseDto: ResearcherProposal;
    researcherProposal: ResearcherProposal;
    newMemberResponseDto: NewMember;
    expertEvaluatorResponseDto: ExpertEvaluator;
    presentationReportResponseDto: PresentationReport;
    presentationEvaluatorsFeedbackList: PresentationEvaluatorsFeedback[];
}
