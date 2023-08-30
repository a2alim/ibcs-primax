import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CrudRequestService} from '../../../core/services/crud-request.service';
import {environment} from '../../../../../environments/environment';
import {TappLogFrameModel} from '../models/tappLogFrame.model';
import {map} from "rxjs/operators";
import {RdppRtappManagementModule} from "../rdpp-rtapp-management.module";

@Injectable({
  providedIn: 'root'
})
export class TappLogFrameService extends CrudRequestService<TappLogFrameModel>{

    constructor(private http: HttpClient) {
        super(http, environment.ibcs.ppsRdppRtappBackendPoint + 'tapp-log-frame/');
    }

    getTappLogFrame(pcUuid){
        const url: string = environment.ibcs.ppsRdppRtappBackendPoint + 'tapp-log-frame/get-data' + '/' + pcUuid;
        return this.http.get(url).pipe(map((res: any) => {
            return res;
        }));
    }

    updateTappLogFrame(model, pcUuid){
        const url: string = environment.ibcs.ppsRdppRtappBackendPoint + 'tapp-log-frame/update-data' + '/' + pcUuid;
        return this.http.put(url, model).pipe(map((res: any) => {
            return res;
        }));
    }
}
