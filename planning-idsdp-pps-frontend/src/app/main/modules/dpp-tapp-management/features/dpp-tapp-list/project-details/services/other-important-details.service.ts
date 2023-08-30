import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {OtherImportantDetailsUrlConstants} from '../constants/other-important-details.url.constants';
import {OtherImportantDetails} from '../models/other-important-details.model';
import {map} from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class OtherImportantDetailsService {

    constructor(private _http: HttpClient) {
    }

    saveOtherImportantDetails(otherImportantDetails: OtherImportantDetails): Observable<any> {
        return this._http.post(OtherImportantDetailsUrlConstants.CREATE_OTHER_IMPORTANT_DETAILS, otherImportantDetails);
    }

    getOtherImportantDetails(projectId) {
        return this._http.get(OtherImportantDetailsUrlConstants.GET_OTHER_IMPORTANT_DETAILS + '/' + projectId).pipe(map((res: any) => {
            return res;
        }));
    }

    updateOtherImportantDetails(model, projectId) {
        return this._http.put(OtherImportantDetailsUrlConstants.UPDATE_OTHER_IMPORTANT_DETAILS + '/' + projectId, model).pipe(map((res: any) => {
            return res;
        }));
    }

}
