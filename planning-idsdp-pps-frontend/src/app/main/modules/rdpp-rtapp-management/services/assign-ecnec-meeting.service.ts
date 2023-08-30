import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CrudRequestService} from '../../../core/services/crud-request.service';
import {environment} from '../../../../../environments/environment';
import {Observable} from 'rxjs';
import {IResponseBody} from '../../../core/models/response';
import {EcnecMeetingModel} from "../models/ecnec-meeting.model";
import {map} from "rxjs/operators";
import {
    ASSING_ECNEC_MEETING,
    CREATE_ASSIGN_MEETING,
    DELETE_ASSIGN_MEETING,
    FIND_BY_PCUUID, GET_PROJECT_LIST_BY_MEETING_ID
} from "../constants/assign-ecnec-meeting.constant";
import {AssignEcnecMeetingModel} from "../models/assign-ecnec-meeting.model";
import {error} from "selenium-webdriver";

@Injectable({
    providedIn: 'root'
})
export class AssingEcnecMeetingService extends CrudRequestService<AssignEcnecMeetingModel> {


    constructor(private http: HttpClient) {
        super(http, ASSING_ECNEC_MEETING);
    }

    createAssignMeeting(model){
        const url: string = this._BASE_URL + CREATE_ASSIGN_MEETING;
        return this.http.post(url, model).pipe(map((res: any) => {
            return res;
        }));
    }

    findByPcUuid(pcUuid: any){
        const url: string = this._BASE_URL + FIND_BY_PCUUID + pcUuid;
        return this.http.get(url).pipe(map((res: any) => {
            return res;
        }));
    }

    deleteAssignMeeting(pcUuid): Observable<any> {
        const url: string = this._BASE_URL + DELETE_ASSIGN_MEETING + pcUuid;
        return this.http.delete(url);
    }

    getProjectListByMeetingId(meetingId: any){
        const url: string = this._BASE_URL + GET_PROJECT_LIST_BY_MEETING_ID + meetingId;
        return this.http.get(url).pipe(map((res: any) => {
            return res;
        }));
    }


}
