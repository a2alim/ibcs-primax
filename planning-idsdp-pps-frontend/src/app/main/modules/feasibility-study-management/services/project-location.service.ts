import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CrudRequestService} from '../../../core/services/crud-request.service';
import {ProjectLocationModel} from '../models/project-location.model';
import {GET_BY_PROJECT_CONCEPT_ID, PROJECT_LOCATION} from '../constants/project-location.constant';
import {Observable, Subject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ProjectLocationService extends CrudRequestService<ProjectLocationModel> {

    private subject = new Subject<any>();

    constructor(private http: HttpClient) {
        super(http, PROJECT_LOCATION);
    }

    feasibilitySummarySaveClickEvent() {
        this.subject.next();
    }

    // for get ProjectSummary Save Event
    getFeasibilitySummarySaveEvent(): Observable<any> {
        return this.subject.asObservable();
    }

    getByProjectConceptId(fsrMasterId: number, pcMasterId: number): Observable<any> {
        return this.http.get<any>(this._BASE_URL + GET_BY_PROJECT_CONCEPT_ID + '/' + fsrMasterId + '/' + pcMasterId);
    }
}
