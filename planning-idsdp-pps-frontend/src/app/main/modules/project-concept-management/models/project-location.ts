import {IIdUuidHolderRequestBody} from '../../../core/models/request';

export interface IProjectLocation extends IIdUuidHolderRequestBody {

    projectConceptMasterId: number;

    dppMasterId: number;

    division: number[];

    zilla: number[];

    upazila: number[];

    municipality: number[];
}
