import {EvaluatorsGrantAmount} from "./EvaluatorsGrantAmount";

export class EvaluatorsGrantAmountLetter {

    id: number;
    uuid: string;
    stFiscalYearId: number;
    topContent: string;
    bottomContent: string;
    uploadSignatureFile: string;
    fiscalYear: any;
    details: EvaluatorsGrantAmount[];
}
