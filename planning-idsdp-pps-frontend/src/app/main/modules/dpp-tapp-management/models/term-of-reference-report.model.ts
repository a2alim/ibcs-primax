import {INameHolderRequestBody} from '../../../core/models/request';
import {DateTime} from "luxon";

export interface ITermOfReferenceReportModel extends INameHolderRequestBody {

    id: number;
    uuid: string;
    reportIndex : number;
    pcUuid: string;
    termOfReference: string;

}
