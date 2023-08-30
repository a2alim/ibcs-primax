import {INameHolderRequestBody} from '../../../core/models/request';
import {IMinistryDivision} from './ministry-divisiont';

export interface IAgency extends INameHolderRequestBody {

    ministryDivisionId: number;
    code: string;
    entryCode: string;
    shortName: string;
    fiscalYear: Date,
    ceilingAmount: number,
    description: string;
    status: boolean;
    ministryDivision: IMinistryDivision;
}
