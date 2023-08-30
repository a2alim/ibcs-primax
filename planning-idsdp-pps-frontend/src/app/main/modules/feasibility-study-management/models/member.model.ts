import {IIdUuidHolderRequestBody} from "../../../core/models/request";

export interface MemberModel extends IIdUuidHolderRequestBody {
    memberName: string;
    designation: string;
    phone: string;
    email: string;
    role: string
}
