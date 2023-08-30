import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {CrudRequestService} from 'app/main/core/services/crud-request.service';
import {Observable} from "rxjs";
import {CoreResponse} from "../../../core/models/response";
import {ResearcherProposalActionPlan} from "../models/ResearcherProposalActionPlan";
import {
    GET_BY_RESEARCHER_PROPOSAL_ID,
    RESEARCHER_PROPOSAL_MARKS,
    SAVE_LIST
} from "../contants/researcher-proposal-marks.constant";
import {ResearcherProposalMarks} from "../models/ResearcherProposalMarks";

@Injectable({
  providedIn: 'root'
})
export class ResearcherProposalMarksService extends CrudRequestService {


  constructor(private http: HttpClient) {
      super(http, RESEARCHER_PROPOSAL_MARKS);
  }

    /**
     * Get by Researcher Proposal Id
     * @param id
     */
    getByResearcherProposalId(id: number): Observable<CoreResponse<ResearcherProposalMarks>> {
        return this.http.get<CoreResponse<ResearcherProposalMarks>>(this._BASE_URL + GET_BY_RESEARCHER_PROPOSAL_ID + "/" + id);
    }

    saveList(data: ResearcherProposalMarks[]): Observable<CoreResponse<ResearcherProposalMarks>> {
        return this.http.post<CoreResponse<ResearcherProposalMarks>>(this._BASE_URL + SAVE_LIST, data);
    }


}
