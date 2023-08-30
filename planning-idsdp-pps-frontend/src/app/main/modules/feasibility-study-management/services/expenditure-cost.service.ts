import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {EXPENDITURE_COST, GET_EXPENDITURE_COST_BY_FSP_MASTER_ID} from '../constants/expenditure-cost.constant';
import {CrudRequestService} from '../../../core/services/crud-request.service';
import {ExpenditureCostModel} from '../models/expenditure-cost.model';
import {Observable, Subject} from 'rxjs';
import {IResponseBody} from '../../../core/models/response';

@Injectable({
  providedIn: 'root'
})
export class ExpenditureCostService extends CrudRequestService<ExpenditureCostModel> {

    private subject = new Subject<any>();

  constructor(private http: HttpClient) {
      super(http, EXPENDITURE_COST);
  }

    feasibilitySummarySaveClickEvent(){
        this.subject.next();
    }

    // for get ProjectSummary Save Event
    getFeasibilitySummarySaveEvent():Observable<any>{
        return this.subject.asObservable();
    }

    // for get ExpenditureCostList By Fsp master id
    getExpenditureCostListByFspMasterId(fspMasterId: number, page?: number, size?: number): Observable<IResponseBody<ExpenditureCostModel>> {
        const pageableRequestBodyDTO = {
            page: page,
            size: size,
        };
        return this.http.post<IResponseBody<ExpenditureCostModel>>(this._BASE_URL + GET_EXPENDITURE_COST_BY_FSP_MASTER_ID, {
            pageableRequestBodyDTO,
            fspMasterId: fspMasterId
        });
    }
}
