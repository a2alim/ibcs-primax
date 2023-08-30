import {Injectable} from '@angular/core';
import {CrudRequestService} from '../../../core/services/crud-request.service';
import {HttpClient} from '@angular/common/http';
import {ProjectType} from '../models/project-type.model';
import {GET_ACTIVE_PROJECT_TYPE, PROJECT_TYPE} from '../constants/project-type.constant';
import {Observable} from 'rxjs';
import {SectorModel} from '../models/sector.model';
import {GET_ACTIVE_SECTOR} from '../constants/sector.constant';

@Injectable({
    providedIn: 'root'
})
export class ProjectTypeService extends CrudRequestService<ProjectType> {

    constructor(private http: HttpClient) {
        super(http, PROJECT_TYPE);
    }

    //For get active status project type api call
    getActiveProjectType(): Observable<ProjectType[]> {
        return this.http.get<ProjectType[]>(this._BASE_URL + GET_ACTIVE_PROJECT_TYPE);
    }
}
