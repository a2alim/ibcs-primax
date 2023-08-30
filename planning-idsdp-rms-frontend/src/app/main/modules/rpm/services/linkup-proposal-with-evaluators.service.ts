import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CrudRequestService } from 'app/main/core/services/crud-request.service';
import { LINKUP_PROPOSAL_WITH_EVALUATORS } from '../contants/linkup-proposal-with-evaluators.constant';

@Injectable({
  providedIn: 'root'
})
export class LinkupProposalWithEvaluatorsService extends CrudRequestService {

  constructor(private http: HttpClient) {
    super(http, LINKUP_PROPOSAL_WITH_EVALUATORS);
  }


  

}
