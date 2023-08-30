import {IIdUuidHolderRequestBody} from '../../../core/models/request';

export interface IComments extends IIdUuidHolderRequestBody {

    fspMasterId: number;
    comment: string;
    observer: string;
    commentBy: string;
    commentOn: Date;
}
