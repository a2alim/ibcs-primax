import {Injectable} from '@angular/core';
import {environment} from '../../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CrudRequestService} from '../../../core/services/crud-request.service';
import {IProjectLocation} from '../../project-concept-management/models/project-location';
import {
    GET_BY_OBJECTIVE_AND_COST_ID_USING_PROJECT_SUMMARY,
    GET_BY_PROJECT_SUMMARY_ID,
    LOCATION
} from '../constants/dpp-location.constant';

@Injectable({
    providedIn: 'root'
})
export class DppLocationService extends CrudRequestService<IProjectLocation> {

    private BASE_API_URL: string = environment.ibcs.configurationApiEndPoint;

    constructor(private http: HttpClient) {
        super(http, LOCATION);
    }

    getByProjectSummaryId(projectSummaryId: number): Observable<any> {
        return this.http.get<any>(this._BASE_URL + GET_BY_PROJECT_SUMMARY_ID + '/' + projectSummaryId);
    }

    getLocationByObjectiveCostIdUsingProjectSummary(id: number): Observable<any> {
        return this.http.get<any>(this._BASE_URL + GET_BY_OBJECTIVE_AND_COST_ID_USING_PROJECT_SUMMARY + '/' + id);
    }
}
