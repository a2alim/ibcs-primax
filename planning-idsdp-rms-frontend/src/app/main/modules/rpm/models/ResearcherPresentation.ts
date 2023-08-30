import {ResearcherProposal} from "./ResearcherProposal";
import {CreateSeminar} from "./CreateSeminar";

export class ResearcherPresentation {

    id: number;
    uuid: string;
    m2CreateSeminarId: number;
    m1ResearcherProposalId: number;
    presentationType: string;
    presentationStatus: string;
    createSeminarDto: CreateSeminar;
    researcherProposalDto: ResearcherProposal;
}
