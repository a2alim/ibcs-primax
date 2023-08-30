import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {CrudRequestService} from 'app/main/core/services/crud-request.service';
import {Observable} from "rxjs";
import {CoreResponse} from "../../../core/models/response";
import {
    GET_BY_RESEARCHER_PROPOSAL_ID,
    RESEARCHER_PROPOSAL_ACTION_PLAN,
    SAVE_LIST,
    SAVE_LIST2
} from "../contants/researcher-proposal-action-plan.constant";
import {ResearcherProposalActionPlan} from "../models/ResearcherProposalActionPlan";

@Injectable({
  providedIn: 'root'
})
export class ResearcherProposalActionPlanService extends CrudRequestService {


  constructor(private http: HttpClient) {
      super(http, RESEARCHER_PROPOSAL_ACTION_PLAN);
  }

    /**
     * Get by Researcher Proposal Id
     * @param id
     */
    getByResearcherProposalId(id: number): Observable<CoreResponse<ResearcherProposalActionPlan>> {
        return this.http.get<CoreResponse<ResearcherProposalActionPlan>>(this._BASE_URL + GET_BY_RESEARCHER_PROPOSAL_ID + "/" + id);
    }

    saveList(data: ResearcherProposalActionPlan[]): Observable<CoreResponse<ResearcherProposalActionPlan>> {
        return this.http.post<CoreResponse<ResearcherProposalActionPlan>>(this._BASE_URL + SAVE_LIST2, data);
    }


}
