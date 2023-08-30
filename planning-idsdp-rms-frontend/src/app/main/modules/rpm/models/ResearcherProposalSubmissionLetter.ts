import {ResearcherProposal} from "./ResearcherProposal";

export class ResearcherProposalSubmissionLetter {

    id: number;
    uuid: string;
    researcherProposalId: number;
    subject: string;
    letterBody: string;
    mailSend: 1 | 0;
    researcherProposalDto: ResearcherProposal;

}
