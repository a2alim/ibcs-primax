import { Injectable } from '@angular/core';
import {CrudRequestService} from '../../../core/services/crud-request.service';
import {HttpClient} from '@angular/common/http';
import {JustificationModel} from '../models/justification.model';
import {map} from 'rxjs/operators';
import {environment} from '../../../../../environments/environment';

export const JUSTIFICATION = environment.ibcs.ppsPcBaseEndPoint + 'justification/';

@Injectable({
  providedIn: 'root'
})
export class JustificationService extends CrudRequestService<JustificationModel>{

  constructor(private http: HttpClient) {
      super(http, JUSTIFICATION);
  }


    createJustification(justification: any, projectConceptMasterId: any ): any {
        const data = {
            justification: justification,
        };
        console.log(justification + 'called');
        const url: string = environment.ibcs.ppsPcBaseEndPoint + 'justification/create' + '/' + projectConceptMasterId;
        return this.http.post(url, data).pipe(map((res: any) => {
            return res;
        }));
    }

    getJustificationListByProject(projectConceptMasterId: any): any {
        const url: string = environment.ibcs.ppsPcBaseEndPoint + 'justification/getJustificationListByProject' + '/' + projectConceptMasterId;
        return this.http.get(url).pipe(map((res: any) => {
            return res;
        }));
    }

    updateJustification(justification: any, projectConceptMasterId: any) {
        const data = {
            justification: justification,
        };
        const url: string = environment.ibcs.ppsPcBaseEndPoint + 'justification/update' + '/' + projectConceptMasterId;
        return this.http.put(url, data).pipe(map((res: any) => {
            return res;
        }));
    }
}
