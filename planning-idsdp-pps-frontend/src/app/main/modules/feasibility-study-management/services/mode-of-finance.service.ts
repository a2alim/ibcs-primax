import { Injectable } from '@angular/core';
import {CrudRequestService} from '../../../core/services/crud-request.service';
import {ModeOfFinanceModel} from '../models/mode-of-finance.model';
import {Observable, Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {MODE_OF_FINANCE, MODE_OF_FINANCE_LIST_BY_FSP_MASTER_ID} from '../constants/mode-of-finance.constant';
import {IResponseBody} from '../../../core/models/response';

@Injectable({
  providedIn: 'root'
})
export class ModeOfFinanceService extends CrudRequestService<ModeOfFinanceModel> {

    private subject = new Subject<any>();

  constructor(private http: HttpClient) {
      super(http, MODE_OF_FINANCE);
  }

    feasibilitySummarySaveClickEvent(){
        this.subject.next();
    }

    // for get Feasibility study proposal summary Save Event
    getFeasibilitySummarySaveEvent():Observable<any>{
        return this.subject.asObservable();
    }

    // for get ModeOfFinanceList By Fs proposal summary
    getModeOfFinanceListByFsProposalSummary(fspMasterId: number, page?: number, size?: number): Observable<IResponseBody<ModeOfFinanceModel>> {
        const pageableRequestBodyDTO = {
            page: page,
            size: size,
        };
        return this.http.post<IResponseBody<ModeOfFinanceModel>>(this._BASE_URL + MODE_OF_FINANCE_LIST_BY_FSP_MASTER_ID, {
            pageableRequestBodyDTO,
            fspMasterId: fspMasterId
        });
    }
}
