import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CrudRequestService} from '../../../core/services/crud-request.service';
import {environment} from '../../../../../environments/environment';
import {Observable} from 'rxjs';
import {IAgency} from '../models/agency';
import {AGENCY, GET_ACTIVE_AGENCY, GET_ACTIVE_AGENCY_BY_MINISTRY_ID} from '../constants/agency.constant';
import {IResponseBody} from '../../../core/models/response';
import {IPriorityModel} from "../models/priority.model";

@Injectable({
    providedIn: 'root'
})
export class AgencyService extends CrudRequestService<IAgency> {


    constructor(private http: HttpClient) {
        super(http, AGENCY);
    }

    // For Getting All Active Agency
    getActiveAgency(page?: number, size?: number): Observable<IResponseBody<IAgency>> {
        return this.http.post<IResponseBody<IAgency>>(this._BASE_URL + GET_ACTIVE_AGENCY, {page: page, size: size});
    }

    getAllAgencyByMinistryDivisionId(ministryId : number){
        return this.http.get<IResponseBody<IAgency>>(this._BASE_URL + GET_ACTIVE_AGENCY_BY_MINISTRY_ID + ministryId);
    }

}
