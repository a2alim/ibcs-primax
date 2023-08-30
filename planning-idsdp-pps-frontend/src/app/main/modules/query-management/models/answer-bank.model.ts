import {IIdUuidHolderRequestBody} from "../../../core/models/request";
import {QueryModel} from "./query.model";

export interface AnswerBankModel extends IIdUuidHolderRequestBody {
    details: string;
    attachmentId: number;
    query: QueryModel;
}
