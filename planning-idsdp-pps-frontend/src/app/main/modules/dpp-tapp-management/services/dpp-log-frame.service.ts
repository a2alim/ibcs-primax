import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CrudRequestService} from '../../../core/services/crud-request.service';
import {environment} from '../../../../../environments/environment';
import {LogFrameModel} from '../models/logFrame.model';
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class DppLogFrameService extends CrudRequestService<LogFrameModel>{

    constructor(private http: HttpClient) {
        super(http, environment.ibcs.ppsDppBackendPoint + 'log-frame/');
    }

    getByProjectConceptUuid(pcUuid) {
        const url: string = environment.ibcs.ppsDppBackendPoint + 'log-frame/getLogFrame' + '/' + pcUuid;
        return this.http.get(url).pipe(map((res: any) => {
            return res;
        }));
    }

    updateLogFrame(model, pcUuid) {
        const url: string = environment.ibcs.ppsDppBackendPoint + 'log-frame/updateLogFrame' + '/' + pcUuid;
        return this.http.put(url, model).pipe(map((res: any) => {
            return res;
        }));
    }
}
