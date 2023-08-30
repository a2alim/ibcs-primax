import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CrudRequestService } from 'app/main/core/services/crud-request.service';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { LINKUP_PROPOSAL_WITH_EVALUATORS } from '../contants/linkup-proposal-with-evaluators.constant';

@Injectable({
  providedIn: 'root'
})
export class LinkupProposalWithEvaluatorsSharedService {


  private behaviorSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  observable$ = this.behaviorSubject.asObservable();
  private data: any = {};

  constructor() { }

  setData(option, value) {
    this.data[option] = value;
    this.behaviorSubject.next(this.data);
  }

}
