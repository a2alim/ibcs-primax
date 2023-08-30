import { Injectable } from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {VISIT_PLAN, VISIT_PLAN_LIST_BY_FSP_MASTER_ID} from '../constants/visit-plan.constant';
import {IResponseBody} from '../../../core/models/response';
import {VisitPlanModel} from '../models/visit-plan.model';
import {CrudRequestService} from '../../../core/services/crud-request.service';

@Injectable({
  providedIn: 'root'
})
export class VisitPlanService extends CrudRequestService<VisitPlanModel> {
    private subject = new Subject<any>();

  constructor(private http: HttpClient) {
      super(http, VISIT_PLAN);
  }

    feasibilitySummarySaveClickEvent(){
        this.subject.next();
    }

    // for get Feasibility study proposal summary Save Event
    getFeasibilitySummarySaveEvent():Observable<any>{
        return this.subject.asObservable();
    }

    // for get VisitPlanList By Fs proposal summary
    getVisitPlanListByFsProposalSummary(fspMasterId: number, page?: number, size?: number): Observable<IResponseBody<VisitPlanModel>> {
        const pageableRequestBodyDTO = {
            page: page,
            size: size,
        };
        return this.http.post<IResponseBody<VisitPlanModel>>(this._BASE_URL + VISIT_PLAN_LIST_BY_FSP_MASTER_ID, {
            pageableRequestBodyDTO,
            fspMasterId: fspMasterId
        });
    }
}
