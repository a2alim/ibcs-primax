import {INameHolderRequestBody} from "../../../core/models/request";

export interface CategoryEnvironmentModel extends INameHolderRequestBody {

    code: string;
    categoryCode: string;
    categoryCodeName: string;
    categoryCodeNameBng: string;
    description: string;
    status: boolean;

}
