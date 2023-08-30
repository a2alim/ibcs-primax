import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CrudRequestService} from '../../../core/services/crud-request.service';
import {GET_ACTIVE_MINISTRY_DIVISION, MINISTRY_DIVISION} from '../constants/ministry-division.constant';
import {IMinistryDivision} from '../models/ministry-divisiont';
import {environment} from '../../../../../environments/environment';
import {Observable} from 'rxjs';
import {IResponseBody} from '../../../core/models/response';

@Injectable({
    providedIn: 'root'
})
export class MinistryDivisionService extends CrudRequestService<IMinistryDivision> {

    baseUrl = '';

    constructor(private http: HttpClient) {
        super(http, MINISTRY_DIVISION);
    }

    // For getting all active Ministry Division list
    getActiveMinistryDivision(page?: number, size?: number): Observable<IResponseBody<IMinistryDivision>> {
        return this.http.post<IResponseBody<IMinistryDivision>>(this._BASE_URL + GET_ACTIVE_MINISTRY_DIVISION, {page: page, size: size});
    }

}
