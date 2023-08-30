import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CrudRequestService} from '../../../core/services/crud-request.service';
import {environment} from '../../../../../environments/environment';
import { TappConsultantModel } from '../models/tapp-consultants.model';
import { Observable } from 'rxjs';
import {map} from 'rxjs/operators';
import {EffectImpactUrlConstant} from "../features/dpp-tapp-list/project-details/constants/effect-impact.url.constants";

@Injectable({
  providedIn: 'root'
})
export class TappConsultantService  {

    constructor(private http: HttpClient) {

    }

    createConsultant(consultantList: any): Observable<any> {

      const url: string = environment.ibcs.ppsDppBackendPoint + 'consultant/create';
      return this.http.post(url, consultantList).pipe(map((res: any) => {
          return res;
      }));
  }

    updateConsultant(model : any): Observable<any> {
        const url: string = environment.ibcs.ppsDppBackendPoint + 'consultant/updateConsultant';
        return this.http.put(url, model).pipe(map((res: any) => {
            return res;
        }));
    }

  getTappAnnexureThree(projectConceptUuid: string){
      const url: string = environment.ibcs.ppsDppBackendPoint + 'consultant/getTappAnnexureThree' + '/' + projectConceptUuid;
      return this.http.get(url).pipe(map((res: any) => {
          return res;
      }));
  }

    deleteRow(uuid): Observable<any> {
        console.log("service hit")
        const url: string = environment.ibcs.ppsDppBackendPoint + 'consultant/deleteRow' + '/' + uuid;
        return this.http.delete(url);
    }
}
