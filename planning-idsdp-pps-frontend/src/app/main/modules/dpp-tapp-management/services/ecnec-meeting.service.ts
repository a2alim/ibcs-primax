import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CrudRequestService} from '../../../core/services/crud-request.service';
import {environment} from '../../../../../environments/environment';
import {Observable} from 'rxjs';
import {IResponseBody} from '../../../core/models/response';
import {EcnecMeetingModel} from "../models/ecnec-meeting.model";
import {ECNEC, GET_ACTIVE_LIST, GET_ALL} from "../constants/ecnec-meeting.constant";

@Injectable({
    providedIn: 'root'
})
export class EcnecMeetingService extends CrudRequestService<EcnecMeetingModel> {


    constructor(private http: HttpClient) {
        super(http, ECNEC);
    }

    // For Getting All Active Ecnec Meeting
    getAllEcnecMeeting(page?: number, size?: number): Observable<IResponseBody<EcnecMeetingModel>> {
        return this.http.post<IResponseBody<EcnecMeetingModel>>(this._BASE_URL + GET_ALL, {page: page, size: size});
    }

    getActiveEcnecMeetingList(): Observable<EcnecMeetingModel[]> {
        return this.http.get<EcnecMeetingModel[]>(this._BASE_URL + GET_ACTIVE_LIST);
    }

    getEnothiEcnecReport(): Observable<any>{
        const url = environment.ibcs.ppsDppBackendPoint + "ecnec/enothi/report/"
        return this.http.get(url);
    }
}
