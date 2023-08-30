import {INameHolderRequestBody} from '../../../core/models/request';

export interface IMainCofog extends INameHolderRequestBody {

    code: string;
    entryCode: string;
    description: string;
    status: boolean;
}
