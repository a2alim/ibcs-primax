import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CrudRequestService} from '../../../core/services/crud-request.service';
import {environment} from '../../../../../environments/environment';
import {PscWorkingPlanModel} from "../models/psc-working-plan.model";
import {map} from "rxjs/operators";
import {Observable} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class PscWorkingPlanService extends CrudRequestService<PscWorkingPlanModel> {

    constructor(private http: HttpClient) {
        super(http, environment.ibcs.ppsDppBackendPoint + 'psc-working-plan/');
    }

    getByPcId(pcUuid, paperType, userType): Observable<PscWorkingPlanModel> {
        const url: string = environment.ibcs.ppsDppBackendPoint + 'psc-working-plan/get-by-pc-id' + '/' + pcUuid + '/' + paperType + '/' + userType;
        return this.http.get<PscWorkingPlanModel>(url).pipe(map((res: any) => {
            return res;
        }));
    }
}
