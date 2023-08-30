import { Injectable } from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {WORK_PLAN} from '../constants/work-plan.constant';
import {CrudRequestService} from '../../../core/services/crud-request.service';
import {WorkPlanModel} from '../models/work-plan.model';
import {environment} from '../../../../../environments/environment';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WorkPlanService extends CrudRequestService<WorkPlanModel> {
    private subject = new Subject<any>();

  constructor(private http: HttpClient) {
      super(http, WORK_PLAN);
  }

    feasibilitySummarySaveClickEvent(){
        this.subject.next();
    }

    // for get Feasibility study proposal summary Save Event
    getFeasibilitySummarySaveEvent():Observable<any>{
        return this.subject.asObservable();
    }

    createWorkPlan(workPlan: any, fspMasterId: any ) {
        const data = {
            workPlanDtoDetails: workPlan,
        };
        const url: string = environment.ibcs.ppsFsBaseEndPoint + 'work-plan/create' + '/' + fspMasterId;
        return this.http.post(url, data).pipe(map((res: any) => {
            return res;
        }));
    }

    updateWorkPlan(workPlan: any, fspMasterId: any) {
        const data = {
            workPlanDtoDetails: workPlan,
        };
        const url: string = environment.ibcs.ppsFsBaseEndPoint + 'work-plan/update' + '/' + fspMasterId;
        return this.http.put(url, data).pipe(map((res: any) => {
            return res;
        }));
    }


    getWorkPlanByFspMasterId(fspMasterId: any): any {
        const url: string = environment.ibcs.ppsFsBaseEndPoint + 'work-plan/getWorkPlanList' + '/' + fspMasterId;
        return this.http.get(url).pipe(map((res: any) => {
            return res;
        }));
    }
}
