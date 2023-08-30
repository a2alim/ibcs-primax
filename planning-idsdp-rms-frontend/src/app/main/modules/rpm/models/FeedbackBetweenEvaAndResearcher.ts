import { ResearcherProposal } from "./ResearcherProposal";
import { CreateSeminar } from "./CreateSeminar";
import { ResearcherPresentation } from "./ResearcherPresentation";

export class FeedbackBetweenEvaluatorAndResearcher {

    id: number;
    uuid: string;
    m2ResearcherPresentationId: number;
    m2CreateSeminarId: number;
    m1ResearcherProposalId: number;
    m1ResearcherProposalUuid: string;
    sendTo: string;
    subject: string;
    receiverMailAddress: string;
    mailBody: string;
    isSent: boolean;
    userId: number;
    createSeminarDto: CreateSeminar;
    researcherProposalDto: ResearcherProposal;
    researcherPresentationDto: ResearcherPresentation;
}
