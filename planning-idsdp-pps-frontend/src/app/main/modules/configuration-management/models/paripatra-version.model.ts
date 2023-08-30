import {INameHolderRequestBody} from '../../../core/models/request';

export interface ParipatraVersion extends INameHolderRequestBody{
    code: string;
    nameEn: string;
    nameBn: string;
    publishDate: Date;
    startDate: Date;
    endDate: Date;
    description: string;
    status: boolean;
}
