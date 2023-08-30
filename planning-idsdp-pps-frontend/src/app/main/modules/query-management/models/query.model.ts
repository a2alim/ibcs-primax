import {IIdUuidHolderRequestBody} from "../../../core/models/request";

export interface QueryModel extends IIdUuidHolderRequestBody {
    ministryDivisionId: number;
    questionTypeId: number;
    questionTitle: string;
    description: string;
    attachmentId: number;
}
