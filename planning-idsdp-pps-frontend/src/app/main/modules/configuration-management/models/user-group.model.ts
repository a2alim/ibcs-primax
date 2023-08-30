import {INameHolderRequestBody} from '../../../core/models/request';
import { IAgency } from './agency';
import { IMinistryDivision } from './ministry-divisiont';

export interface UserGroup extends INameHolderRequestBody {
    // code: string;
    // nameEn: string;
    // nameBn: string;
    // departmentId: number;
    // description: string;
    // status: boolean;

    // -------- //
       user:{
           id:number,
           dutyType: string
       };
       checked:boolean;
       agency:IAgency;
       ministry:IMinistryDivision;
       userId: number;
       dutyType: string,
    // -------- //
}
