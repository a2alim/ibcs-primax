import {INameHolderRequestBody} from '../../../core/models/request';

export interface ProjectType extends INameHolderRequestBody{
    code: string;
    projectTypeCode: string;
    nameEn: string;
    nameBn: string;
    description: string;
    status: boolean;
}
