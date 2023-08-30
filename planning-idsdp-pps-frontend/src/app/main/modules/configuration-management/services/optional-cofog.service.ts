import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CrudRequestService} from '../../../core/services/crud-request.service';
import {environment} from '../../../../../environments/environment';
import {Observable} from 'rxjs';
import {IOptionalCofog} from '../models/optional-cofog';
import {GET_ACTIVE_OPTIONAL_COFOG, GET_BY_MAIN_COFOG_ID, OPTIONAL_COFOG} from '../constants/optional-cofog.constant';
import {IResponseBody} from '../../../core/models/response';

@Injectable({
    providedIn: 'root'
})
export class OptionalCofogService extends CrudRequestService<IOptionalCofog> {

    baseUrl = '';

    constructor(private http: HttpClient) {
        super(http, OPTIONAL_COFOG);
    }

    // For getting all active Optional Cofog list
    getActiveOptionalCofog(page?: number, size?: number): Observable<IResponseBody<IOptionalCofog>> {
        return this.http.post<IResponseBody<IOptionalCofog>>(this._BASE_URL + GET_ACTIVE_OPTIONAL_COFOG, {page: page, size: size} );
    }

    // For getting all active Optional Cofog list by Main cofog ID
    getByMainCofogId(mainCofogId: number): Observable<IOptionalCofog[]> {
        return this.http.get<IOptionalCofog[]>(this._BASE_URL + GET_BY_MAIN_COFOG_ID + '/' + mainCofogId);
    }

}
