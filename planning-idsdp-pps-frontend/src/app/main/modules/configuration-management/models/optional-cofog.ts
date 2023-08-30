import {INameHolderRequestBody} from '../../../core/models/request';
import {IMinistryDivision} from './ministry-divisiont';
import {IMainCofog} from './main-cofog';

export interface IOptionalCofog extends INameHolderRequestBody {

    mainCofogId: number;
    code: string;
    entryCode: string;
    description: string;
    status: boolean;
    mainCofog: IMainCofog;
}
