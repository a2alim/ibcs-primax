import {INameHolderRequestBody} from '../../../core/models/request';
import {DateTime} from "luxon";

export interface EcnecMeetingModel extends INameHolderRequestBody {

    id: number;
    uuid: string;
    meetingName: string;
    description: string;
    meetingDate: Date;
    meetingTime: DateTime;
    meetingVenue: string,
    status: boolean,
    meetingStatus: boolean,
}
