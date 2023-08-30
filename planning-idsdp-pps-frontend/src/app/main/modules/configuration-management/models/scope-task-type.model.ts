import {INameHolderRequestBody} from '../../../core/models/request';

export interface ScopeTaskType extends INameHolderRequestBody{
    code: string;
    nameEn: string;
    nameBn: string;
    description: string;
    status: boolean;
}
