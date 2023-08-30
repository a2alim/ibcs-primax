import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CrudRequestService} from '../../../core/services/crud-request.service';
import {environment} from '../../../../../environments/environment';
import { TermOfReferenceModel } from '../models/tapp-term-of-reference.model';
import {map} from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TermOfReferenceService extends CrudRequestService<TermOfReferenceModel>{

    constructor(public http: HttpClient) {
        super(http, environment.ibcs.ppsDppBackendPoint + 'termOfReference/');
    }

    getReference(projectId: string):Observable<any>{

      const url: string = environment.ibcs.ppsDppBackendPoint + 'termOfReference/getReference'+ '/' + projectId;
        return this.http.get(url).pipe(map((res: any) => {
            return res;
        }));

    }

    updateReference(data, projectId: any){
      const url: string = environment.ibcs.ppsDppBackendPoint + 'termOfReference/updateReference' + '/' + projectId;
        return this.http.put(url, data).pipe(map((res: any) => {
            return res;
        }));
    }

    createReference(data){
        const url: string = environment.ibcs.ppsDppBackendPoint + 'termOfReference/create-reference';
        return this.http.post(url, data).pipe(map((res: any) => {
            return res;
        }));
    }

    
}
