import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {CrudRequestService} from 'app/main/core/services/crud-request.service';
import {GET_BY_RESEARCHER_PROPOSAL_ID, SAVE_LIST} from "../contants/researcher-proposal-info.constant";
import {Observable} from "rxjs";
import {CoreResponse} from "../../../core/models/response";
import {RESEARCHER_PROPOSAL_BUDGET_DETAILS} from "../contants/researcher-proposal-budget-details.constant";
import {ResearcherProposalBudgetDetails} from "../models/ResearcherProposalBudgetDetails";

@Injectable({
  providedIn: 'root'
})
export class ResearcherProposalBudgetDetailsService extends CrudRequestService {


  constructor(private http: HttpClient) {
      super(http, RESEARCHER_PROPOSAL_BUDGET_DETAILS);
  }

    /**
     * Get by Researcher Proposal Id
     * @param id
     */
    getByResearcherProposalId(id: number): Observable<CoreResponse<ResearcherProposalBudgetDetails>> {
        return this.http.get<CoreResponse<ResearcherProposalBudgetDetails>>(this._BASE_URL + GET_BY_RESEARCHER_PROPOSAL_ID + "/" + id);
    }

    saveList(data: ResearcherProposalBudgetDetails[]): Observable<CoreResponse<any>> {
        return this.http.post<CoreResponse<any>>(this._BASE_URL + SAVE_LIST, data);
    }


}
