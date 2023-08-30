import {IIdUuidHolderRequestBody} from "../../../core/models/request";
import {MemberModel} from "./member.model";

export interface CommitteeModel extends IIdUuidHolderRequestBody {
    committeeName: string;
    description: string;
    dateOfFormation: Date;
    attachmentId: number;
    fspMasterId: number;
    members: MemberModel[];
}
