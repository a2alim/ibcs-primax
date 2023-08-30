import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CrudRequestService} from '../../../core/services/crud-request.service';
import {GET_BY_PROJECT_SUMMARY_ID, PROJECT_LOCATION} from '../constants/project-location.constant';
import {IProjectLocation} from '../models/project-location';
import {Observable} from 'rxjs';
import {IResponseBody} from '../../../core/models/response';
import {IMinistryDivision} from '../../configuration-management/models/ministry-divisiont';
import {GET_ACTIVE_MINISTRY_DIVISION} from '../../configuration-management/constants/ministry-division.constant';

@Injectable({
    providedIn: 'root'
})
export class ProjectLocationService extends CrudRequestService<IProjectLocation> {


    constructor(private http: HttpClient) {
        super(http, PROJECT_LOCATION);
    }

    getByProjectSummaryId(projectConceptMasterId: number): Observable<any> {
        return this.http.get<any>(this._BASE_URL + GET_BY_PROJECT_SUMMARY_ID + '/' + projectConceptMasterId);
    }

}
