import {INameHolderRequestBody} from '../../../core/models/request';
import {IMinistryDivision} from './ministry-divisiont';
import {IOptionalCofog} from './optional-cofog';

export interface IDetailsCofog extends INameHolderRequestBody {

    optionalCofogId: number;
    code: string;
    entryCode: string;
    description: string;
    status: boolean;
    optionalCofog: IOptionalCofog;
}
