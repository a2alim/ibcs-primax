import {ResearcherProposal} from "./ResearcherProposal";
import {ExpertEvaluator} from "../../settings/models/expert-evaluator.model";

export class EvaluatorsGrantAmount {

    id: number;
    uuid: string;
    rmsEvaluatorsGrantAmountLetterId: number;
    researcherProposalId: number;
    stProfileOfExpertEvaluatorsId: number;
    grantAmount: number;
    researcherProposalDto: ResearcherProposal;
    evaluator: ExpertEvaluator;
    deleted: 1 | 0;
}
