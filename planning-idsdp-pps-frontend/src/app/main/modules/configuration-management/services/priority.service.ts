import {Injectable} from '@angular/core';
import {CrudRequestService} from '../../../core/services/crud-request.service';
import {IPriorityModel} from '../models/priority.model';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../../environments/environment';
import {Observable} from 'rxjs';
import {IResponseBody} from '../../../core/models/response';

@Injectable({
    providedIn: 'root'
})
export class PriorityService extends CrudRequestService<IPriorityModel> {

    constructor(private http: HttpClient) {
        super(http, environment.ibcs.configurationApiEndPoint + 'priority/');
    }

    // For getting all active Priority list
    getActivePriority(): Observable<IPriorityModel[]> {
        return this.http.get<IPriorityModel[]>(this._BASE_URL + 'getActivePriority');
    }

}
