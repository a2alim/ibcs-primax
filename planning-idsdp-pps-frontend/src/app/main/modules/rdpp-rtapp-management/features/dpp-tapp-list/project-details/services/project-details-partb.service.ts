import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {ProjectDetailsPartBUrlConstant} from '../constants/project-details-partb.url.constant';
import {ProjectDetailsPartB} from '../models/project-details-partb.model';
import {CrudRequestService} from "../../../../../../core/services/crud-request.service";
import {environment} from "../../../../../../../../environments/environment";
import {map} from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class ProjectDetailsPartbService extends CrudRequestService<ProjectDetailsPartB> {

    public projectDetailsPartBSubject = new Subject<string>();

    constructor(public _http: HttpClient) {
        super(_http, environment.ibcs.ppsDppBackendPoint);
    }

    saveProjectDetailsPartB(projectDetailsPartB: ProjectDetailsPartB): Observable<any> {
        console.log(projectDetailsPartB);
        return this._http.post(ProjectDetailsPartBUrlConstant.CREATE_PROJECT_DETAILS, projectDetailsPartB)
    }

    getProjectDetailsPartBuuid(): Observable<string> {
        return this.projectDetailsPartBSubject.asObservable();
    }

    // getProjectDetails(id: number){
    //     return this._http.get(ProjectDetailsPartBUrlConstant.GET_PROJECT_DETAILS + '/' + id);
    // }

    getProjectDetailsByProjectId(projectId: string) {
        return this._http.get(ProjectDetailsPartBUrlConstant.GET_PROJECT_DETAILS + '/' + projectId).pipe(map((res: any) => {
            return res;
        }));
    }

    updateProjectDetails(model, projectId) {
        console.log("hit service.....................")
        return this._http.put(ProjectDetailsPartBUrlConstant.UPDATE_PROJECT_DETAILS + '/' + projectId, model).pipe(map((res: any) => {
            return res;
        }));

    }
}
