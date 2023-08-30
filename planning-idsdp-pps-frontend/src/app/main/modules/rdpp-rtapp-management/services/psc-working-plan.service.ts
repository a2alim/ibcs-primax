import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CrudRequestService} from '../../../core/services/crud-request.service';
import {environment} from '../../../../../environments/environment';
import {PscWorkingPlanModel} from "../models/psc-working-plan.model";
import {map} from "rxjs/operators";
import {Observable} from "rxjs";
import {RdppRtappManagementModule} from "../rdpp-rtapp-management.module";

@Injectable({
    providedIn: 'root'
})
export class PscWorkingPlanService extends CrudRequestService<PscWorkingPlanModel> {

    constructor(private http: HttpClient) {
        super(http, environment.ibcs.ppsRdppRtappBackendPoint + 'psc-working-plan/');
    }

    getByPcId(id: number): Observable<PscWorkingPlanModel> {
        const url: string = environment.ibcs.ppsRdppRtappBackendPoint + 'psc-working-plan/get-by-pc-id' + '/' + id;
        return this.http.get<PscWorkingPlanModel>(url).pipe(map((res: any) => {
            return res;
        }));
    }
}
