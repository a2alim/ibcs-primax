import {INameHolderRequestBody} from '../../../core/models/request';
import {DateTime} from "luxon";

export interface AssignEcnecMeetingListModel extends INameHolderRequestBody {

    isForeignAid : boolean;
    projectType : string;
    projectTitle : string;
    ministryDivision : string;
    implementingAgency : string;
    dateCommencement : Date;
    dateCompletion : Date;
    totalAmount : number;
    gobAmount : number;
    gobFeAmount : number;
    paAmount : number;
    rpaAmount : number;
    ownFundAmount : number;
    ownFeFundAmount : number;
    otherAmount : number;
    otherFeAmount : number;
}
