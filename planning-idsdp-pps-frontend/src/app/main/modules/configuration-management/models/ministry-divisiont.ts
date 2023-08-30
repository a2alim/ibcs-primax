import {INameHolderRequestBody} from '../../../core/models/request';

export interface IMinistryDivision extends INameHolderRequestBody {

    code: string;
    entryCode: string;
    shortName: string;
    description: string;
    status: boolean;
}
