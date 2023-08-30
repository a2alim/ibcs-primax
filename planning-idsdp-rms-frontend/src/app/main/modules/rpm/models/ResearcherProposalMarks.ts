import {ResearcherProposal} from "./ResearcherProposal";
import {EvaluationFieldType} from "../contants/different-type.constant";

export class ResearcherProposalMarks {

    id: number;
    uuid: string;
    researcherProposalId: number;
    evaluationFieldType: string;
    markOne: number;
    markTwo: number;
    markThree: number;
    markFour: number;
    markFive: number;
    markSix: number;
    markSeven: number;
    markEight: number;
    markNine: number;
    markTen: number;
    totalMarks: number;
    researcherProposalDto?: ResearcherProposal;
    comments:string;
    isDraft: boolean;
}
