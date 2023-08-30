import { Injectable } from '@angular/core';
import {CrudRequestService} from "../../../core/services/crud-request.service";
import {LogFrameModel} from "../models/logFrame.model";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../../environments/environment";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class RdppLogFrameService extends CrudRequestService<LogFrameModel>{

    constructor(private http: HttpClient) {
        super(http, environment.ibcs.ppsRdppRtappBackendPoint + 'log-frame/');
    }

    getByRdppId(id: number) {
        const url: string = environment.ibcs.ppsRdppRtappBackendPoint + 'log-frame/getLogFrameById' + '/' + id;
        return this.http.get(url).pipe(map((res: any) => {
            return res;
        }));
    }

    updateLogFrame(model, id) {
        const url: string = environment.ibcs.ppsRdppRtappBackendPoint + 'log-frame/updateLogFrame' + '/' + id;
        return this.http.put(url, model).pipe(map((res: any) => {
            return res;
        }));
    }
}
