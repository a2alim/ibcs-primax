import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CrudRequestService} from '../../../core/services/crud-request.service';
import {Observable} from 'rxjs';
import {IMainCofog} from '../models/main-cofog';
import {GET_ACTIVE_MAIN_COFOG, MAIN_COFOG} from '../constants/main-cofog.constant';
import {IResponseBody} from '../../../core/models/response';

@Injectable({
    providedIn: 'root'
})
export class MainCofogService extends CrudRequestService<IMainCofog> {

    constructor(private http: HttpClient) {
        super(http, MAIN_COFOG);
    }

    // For getting all active Main Cofog list
    getActiveMainCofog(page?: number, size?: number): Observable<IResponseBody<IMainCofog>> {
        return this.http.post<IResponseBody<IMainCofog>>(this._BASE_URL + GET_ACTIVE_MAIN_COFOG, {page: page, size: size});
    }
}
