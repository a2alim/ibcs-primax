import { Injectable } from '@angular/core';
import {map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../../environments/environment';
import {CrudRequestService} from '../../../core/services/crud-request.service';
import {ScopeOfWorkModel} from '../models/scope-of-work.model';

export const SCOPEOFWORK = environment.ibcs.ppsPcBaseEndPoint + 'scopeOfWork/';

@Injectable({
  providedIn: 'root'
})
export class ScopeOfWorkService extends CrudRequestService<ScopeOfWorkModel>{

  constructor(private http: HttpClient) {
      super(http, SCOPEOFWORK );
  }

    createScopeOfWork(scopeOfWork: any, projectConceptMasterId: any ) {
        const data = {
            scopeOfWorkDtoDetails: scopeOfWork,
        };
        const url: string = environment.ibcs.ppsPcBaseEndPoint + 'scopeOfWork/create' + '/' + projectConceptMasterId;
        return this.http.post(url, data).pipe(map((res: any) => {
            return res;
        }));
    }

    updateScopeOfWork(scopeOfWork: any, projectConceptMasterId: any) {
        const data = {
            scopeOfWorkDtoDetails: scopeOfWork,
        };
        const url: string = environment.ibcs.ppsPcBaseEndPoint + 'scopeOfWork/update' + '/' + projectConceptMasterId;
        return this.http.put(url, data).pipe(map((res: any) => {
            return res;
        }));
    }


    getScopeOfWorkListByProjectId(projectConceptMasterId: any): any {
        const url: string = environment.ibcs.ppsPcBaseEndPoint + 'scopeOfWork/getScopeOfWorkListByProjectId' + '/' + projectConceptMasterId;
        return this.http.get(url).pipe(map((res: any) => {
            return res;
        }));
    }
}
