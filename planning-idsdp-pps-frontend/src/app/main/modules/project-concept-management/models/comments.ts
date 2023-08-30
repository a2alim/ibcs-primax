import {IIdUuidHolderRequestBody} from '../../../core/models/request';
import {User} from "../../../core/user/user.model";

export interface IComments extends IIdUuidHolderRequestBody {

    projectConceptMasterId: number;
    comment: string;
    observer: string;
    commentBy: string;
    commentOn: Date;
    commenter: User;
    canEdit: boolean;
}
