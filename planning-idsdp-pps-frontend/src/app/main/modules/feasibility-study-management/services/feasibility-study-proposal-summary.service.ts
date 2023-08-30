import { Injectable } from '@angular/core';
import {CrudRequestService} from '../../../core/services/crud-request.service';
import {FeasibilityStudyProposalSummaryModel} from '../models/feasibility-study-proposal-summary.model';
import {HttpClient} from '@angular/common/http';
import {FSP_SUMMARY, GET_FSP_SUMMARY} from '../constants/feasibility-study-proposal-summary.constant';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FeasibilityStudyProposalSummaryService extends CrudRequestService<FeasibilityStudyProposalSummaryModel> {

  constructor(private http: HttpClient) {
      super(http, FSP_SUMMARY);
  }

  //get fs proposal summary by project concept uuid back end api call
  getFspSummaryByPcUuid(pcUuid: any): any {
      const url: string = GET_FSP_SUMMARY + '/' + pcUuid;
      return this.http.get(url).pipe(map((res: any) => {
            return res;
      }));
  }
}
