import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {environment} from '../../../../../environments/environment';
import {Observable} from 'rxjs';
import {CrudRequestService} from 'app/main/core/services/crud-request.service';


@Injectable({
    providedIn: 'root'
})
export class CommonTypeService extends CrudRequestService {

    baseRmsConfigurationApiEndPoint = environment.ibcs.rmsConfigurationBackend;

    constructor(private http: HttpClient) {
        super(http, environment.ibcs.rmsConfigurationBackend + 'api/common-type/');
    }

    findAllByActiveData(typeNo: number): Observable<any> {
        return this.http.get<Observable<any>>(this._BASE_URL + 'get-seciality' + "/" + typeNo);
    }


}
