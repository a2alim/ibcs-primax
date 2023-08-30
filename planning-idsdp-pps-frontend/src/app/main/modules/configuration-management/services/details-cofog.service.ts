import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CrudRequestService} from '../../../core/services/crud-request.service';
import {environment} from '../../../../../environments/environment';
import {Observable} from 'rxjs';
import {IDetailsCofog} from '../models/details-cofog';
import {DETAILS_COFOG, GET_ACTIVE_DETAILS_COFOG, GET_BY_OPTIONAL_COFOG_ID} from '../constants/details-cofog.constant';
import {IResponseBody} from '../../../core/models/response';
import {IOptionalCofog} from '../models/optional-cofog';
import {GET_BY_MAIN_COFOG_ID} from '../constants/optional-cofog.constant';

@Injectable({
    providedIn: 'root'
})
export class DetailsCofogService extends CrudRequestService<IDetailsCofog> {

    baseUrl = '';

    constructor(private http: HttpClient) {
        super(http, DETAILS_COFOG);
    }

    // For getting all active Detail Cofog list
    getActiveDetailsCofog(page?: number, size?: number): Observable<IResponseBody<IDetailsCofog>> {
        return this.http.post<IResponseBody<IDetailsCofog>>(this._BASE_URL + GET_ACTIVE_DETAILS_COFOG, {page: page, size: size});
    }

    // For getting all active Detail Cofog list By Option Cofog Id
    getByOptionalCofogId(optionalCofogId: number): Observable<IDetailsCofog[]> {
        return this.http.get<IDetailsCofog[]>(this._BASE_URL + GET_BY_OPTIONAL_COFOG_ID + '/' + optionalCofogId);
    }

}
