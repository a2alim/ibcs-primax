import {Injectable} from '@angular/core';
import {CrudRequestService} from '../../../core/services/crud-request.service';
import {HttpClient} from '@angular/common/http';
import {ParipatraVersion} from '../models/paripatra-version.model';
import {GET_ACTIVE_SINGLE_PARIPATRA_VERSION, PARIPATRA_VERISON} from '../constants/paripatra-version.constant';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ParipatraVersionService extends CrudRequestService<ParipatraVersion> {

    constructor(private http: HttpClient) {
        super(http, PARIPATRA_VERISON);
    }

    //For get active status paripatra api call
    getActiveSingleParipatraVersion(): Observable<ParipatraVersion> {
        return this.http.get<ParipatraVersion>(GET_ACTIVE_SINGLE_PARIPATRA_VERSION);
    }
}
