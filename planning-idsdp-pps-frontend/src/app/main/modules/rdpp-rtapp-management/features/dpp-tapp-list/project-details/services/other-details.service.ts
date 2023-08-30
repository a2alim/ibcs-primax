import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {OtherDetailsUrlConstant} from '../constants/other-details.url.constants';
import {map} from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class OtherDetailsService {

    constructor(private _http: HttpClient) {
    }

    saveOtherDetails(OtherDetails): Observable<any> {
        return this._http.post(OtherDetailsUrlConstant.CREATE_OTHER_DETAILS, OtherDetails);
    }

    getOtherDetails(projectId) {
        return this._http.get(OtherDetailsUrlConstant.GET_OTHER_DETAILS + '/' + projectId).pipe(map((res: any) => {
            return res;
        }));
    }

    updateOtherDetails(model, projectId) {
        return this._http.put(OtherDetailsUrlConstant.UPDATE_OTHER_DETAILS + '/' + projectId, model).pipe(map((res: any) => {
            return res;
        }));
    }
}
