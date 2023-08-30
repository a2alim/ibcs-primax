import {ResearcherProposal} from "./ResearcherProposal";
import {ResearcherPresentation} from "./ResearcherPresentation";
import {NewMember} from "./NewMember";
import {ExpertEvaluator} from "../../settings/models/expert-evaluator.model";

export class EvaluatorNewMemberAttendance {

    id: number;
    uuid: string;
    m2ResearcherPresentationId: number;
    m1ResearcherProposalId: number;
    stProfileOfExpertEvaluatorsId: number;
    m2AddNewMemberId: number;
    isPresent: boolean;
    researcherPresentationResponseDto: ResearcherPresentation;
    researcherProposalResponseDto: ResearcherProposal;
    newMemberResponseDto: NewMember;
    expertEvaluatorResponseDto: ExpertEvaluator;
    researcherPresentation:  ResearcherPresentation;
    researcherProposal: ResearcherProposal;
}
