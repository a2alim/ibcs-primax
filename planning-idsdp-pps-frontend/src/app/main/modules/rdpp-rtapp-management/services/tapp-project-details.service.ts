import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CrudRequestService } from '../../../core/services/crud-request.service';
import { environment } from '../../../../../environments/environment';
import { TappProjectDetailsModel } from '../models/tappProjectDetails.model';
import { Observable } from 'rxjs';
import {map} from "rxjs/operators";
import {RdppRtappManagementModule} from "../rdpp-rtapp-management.module";

@Injectable({
    providedIn: 'root'
})
export class TappProjectDetailsService extends CrudRequestService<TappProjectDetailsModel> {

    constructor(private http: HttpClient, ) {
      super(http, environment.ibcs.ppsRdppRtappBackendPoint+ 'project-details/');
  }

    getData(route): Observable<any> {
        const url = this._BASE_URL + route;
        return this.http.get(url);
    }

    saveData(model: any) {
        const url: string = environment.ibcs.ppsRdppRtappBackendPoint + 'project-details/create';
        return this.http.post(url, model).pipe(map((res: any) => {
            return res;
        }));
    }

    updateData(model: any, pcUuid: any) {
        const url: string = environment.ibcs.ppsRdppRtappBackendPoint + 'project-details/update-data'+ '/' + pcUuid;
        return this.http.put(url, model).pipe(map((res: any) => {
            return res;
        }));
    }

    getProjectDetails(pcUuid){
        const url: string = environment.ibcs.ppsRdppRtappBackendPoint + 'project-details/getProjectDetails'+'/'+pcUuid;
        return this.http.get(url).pipe(map((res: any) => {
            return res;
        }));
    }
}
