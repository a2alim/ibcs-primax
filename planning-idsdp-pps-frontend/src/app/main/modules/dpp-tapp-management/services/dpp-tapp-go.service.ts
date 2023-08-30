import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CrudRequestService } from '../../../core/services/crud-request.service';
import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs';
import { IResponseBody } from '../../../core/models/response';
import { EcnecMeetingModel } from '../models/ecnec-meeting.model';
import {
    ECNEC,
    GET_ACTIVE_LIST,
    GET_ALL,
} from '../constants/ecnec-meeting.constant';
import { map } from 'rxjs/operators';
import {
    ASSING_ECNEC_MEETING,
    CREATE_ASSIGN_MEETING,
    DELETE_ASSIGN_MEETING,
    FIND_BY_PCUUID,
} from '../constants/assign-ecnec-meeting.constant';
import { AssignEcnecMeetingModel } from '../models/assign-ecnec-meeting.model';
import { error } from 'selenium-webdriver';

@Injectable({
    providedIn: 'root',
})
export class DppTappGoService {

    BASE_URL = `${environment.ibcs.ppsDppBackendPoint}dpp-tapp-go`;
    CREATE_OR_UPDATE = `${this.BASE_URL}/create-go-ao`;
    FIND_BY = `${this.BASE_URL}/find-by`;

    constructor(private http: HttpClient) {}

    createOrUpdate(data) {
        return this.http.post(this.CREATE_OR_UPDATE, data).pipe(
            map((res: any) => {
                return res;
            })
        );
    }

    findByPcUuid(pcUuid: any, orderType) {
        return this.http.get(this.FIND_BY+"/"+pcUuid+"/"+orderType).pipe(
            map((res: any) => {
                return res;
            })
        );
    }

    // deleteAssignMeeting(pcUuid): Observable<any> {
    //     const url: string = this._BASE_URL + DELETE_ASSIGN_MEETING + pcUuid;
    //     return this.http.delete(url);
    // }

    // // For Getting All Active Ecnec Meeting
    // getAllEcnecMeeting(
    //     page?: number,
    //     size?: number
    // ): Observable<IResponseBody<EcnecMeetingModel>> {
    //     return this.http.post<IResponseBody<EcnecMeetingModel>>(
    //         this._BASE_URL + GET_ALL,
    //         { page: page, size: size }
    //     );
    // }

    // getActiveEcnecMeetingList(): Observable<EcnecMeetingModel[]> {
    //     return this.http.get<EcnecMeetingModel[]>(
    //         this._BASE_URL + GET_ACTIVE_LIST
    //     );
    // }
}
