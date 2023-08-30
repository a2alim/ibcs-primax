import { Injectable } from '@angular/core';
import {CrudRequestService} from "../../../core/services/crud-request.service";
import {DppProjectManagementModel} from "../models/dppProjectManagement.model";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../../environments/environment";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class RdppProjectManagementService extends CrudRequestService<DppProjectManagementModel>{

    constructor(private http: HttpClient) {
        super(http, environment.ibcs.ppsRdppRtappBackendPoint + 'project-management/');
    }

    updateProjectConcept(model, pcUuid){
        const url: string = environment.ibcs.ppsRdppRtappBackendPoint + 'project-management/updateProManagement' + '/' + pcUuid;
        return this.http.put(url, model).pipe(map((res: any) => {
            return res;
        }));
    }


    getProjectManagementByRdppMasterId(id) {
        const url: string = environment.ibcs.ppsRdppRtappBackendPoint + 'project-management/getProManagementById' + '/' + id;
        return this.http.get(url).pipe(map((res: any) => {
            return res;
        }));
    }

}

