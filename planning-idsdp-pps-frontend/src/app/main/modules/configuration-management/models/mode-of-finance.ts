import {INameHolderRequestBody} from '../../../core/models/request';

export interface IModeOfFinance extends INameHolderRequestBody {

    code: string;
    description: string;
    status: boolean;
    editable: boolean;
    orderId: number;
    isActive: boolean;
}
