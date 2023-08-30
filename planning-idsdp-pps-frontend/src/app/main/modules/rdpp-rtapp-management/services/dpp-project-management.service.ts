import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CrudRequestService} from '../../../core/services/crud-request.service';
import {environment} from '../../../../../environments/environment';
import {DppProjectManagementModel} from '../models/dppProjectManagement.model';
import {map} from "rxjs/operators";
import {RdppRtappManagementModule} from "../rdpp-rtapp-management.module";

@Injectable({
  providedIn: 'root'
})
export class DppProjectManagementService extends CrudRequestService<DppProjectManagementModel>{

    constructor(private http: HttpClient) {
        super(http, environment.ibcs.ppsDppBackendPoint + 'project-management/');
    }

    getByProjectConceptUuid(pcUuid) {
        const url: string = environment.ibcs.ppsDppBackendPoint + 'project-management/getProManagement' + '/' + pcUuid;
        return this.http.get(url).pipe(map((res: any) => {
            return res;
        }));
    }

    updateProjectConcept(model, pcUuid){
        const url: string = environment.ibcs.ppsRdppRtappBackendPoint + 'project-management/updateProManagement' + '/' + pcUuid;
        return this.http.put(url, model).pipe(map((res: any) => {
            return res;
        }));
    }
}
