import {INameHolderRequestBody} from '../../../core/models/request';

export interface ProjectMovementModel extends INameHolderRequestBody {
    orderId: number;
    code: string;
    statusButtonPosition: string;
    editable: boolean;
    movementTitleEn: string;
    movementTitleBn: string;
    description: string;
    moduleId: number;
    userGroupId: number;
    status: boolean;
}
