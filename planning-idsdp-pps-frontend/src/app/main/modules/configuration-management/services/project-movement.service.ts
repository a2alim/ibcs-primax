import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CrudRequestService} from '../../../core/services/crud-request.service';
import {ProjectMovementModel} from '../models/project-movement.model';
import {
    ALL_PROJECT_MOVEMENT_BY_ORDER_ID_AND_MODULE,
    GET_ACTIVE_PROJECT_MOVEMENT,
    GET_PROJECT_MOVEMENT_BY_ORDER_ID,
    MOVE_PROJECT,
    PROJECT_MOVEMENT
} from '../constants/project-movement.constant';
import {IResponseBody} from '../../../core/models/response';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ProjectMovementService extends CrudRequestService<ProjectMovementModel> {

    baseUrl = '';

    constructor(private http: HttpClient) {
        super(http, PROJECT_MOVEMENT);
    }

    // for get ActiveProjectMovement
    getActiveProjectMovement(page: number, size: number): Observable<IResponseBody<ProjectMovementModel>> {
        return this.http.get<IResponseBody<ProjectMovementModel>>(this._BASE_URL + GET_ACTIVE_PROJECT_MOVEMENT + '/' + page + '/' + size);
    }

    // for get ProjectMovement By OrderId
    getProjectMovementByOrderId(page: number, size: number): Observable<IResponseBody<ProjectMovementModel>> {
        return this.http.get<IResponseBody<ProjectMovementModel>>(this._BASE_URL + GET_PROJECT_MOVEMENT_BY_ORDER_ID + '/' + page + '/' + size);
    }

    // for get AllProjectMovement By OrderId And Module
    getAllProjectMovementByOrderIdAndModule(moduleId: number): Observable<ProjectMovementModel[]> {
        return this.http.get<ProjectMovementModel[]>(this._BASE_URL + ALL_PROJECT_MOVEMENT_BY_ORDER_ID_AND_MODULE + '/' + moduleId);
    }

    // move project row
    moveProject(projectIds) {
        const projectMove = {
            projectIds: projectIds
        };
        return this.http.post(this._BASE_URL + MOVE_PROJECT, projectMove);
    }
}
