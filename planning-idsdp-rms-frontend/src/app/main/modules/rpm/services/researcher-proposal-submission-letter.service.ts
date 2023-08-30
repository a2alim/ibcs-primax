import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {CrudRequestService} from 'app/main/core/services/crud-request.service';
import {Observable} from "rxjs";
import {CoreResponse} from "../../../core/models/response";
import {
    GET_BY_RESEARCHER_PROPOSAL_ID,
    RESEARCHER_PROPOSAL_SUBMISSION_LETTER
} from "../contants/researcher-proposal-submission-letter.constant";
import {ResearcherProposalSubmissionLetter} from "../models/ResearcherProposalSubmissionLetter";

@Injectable({
  providedIn: 'root'
})
export class ResearcherProposalSubmissionLetterService extends CrudRequestService {


  constructor(private http: HttpClient) {
      super(http, RESEARCHER_PROPOSAL_SUBMISSION_LETTER);
  }

    /**
     * Get by Researcher Proposal Id
     * @param id
     */
    getByResearcherProposalId(id: number): Observable<CoreResponse<ResearcherProposalSubmissionLetter>> {
        return this.http.get<CoreResponse<ResearcherProposalSubmissionLetter>>(this._BASE_URL + GET_BY_RESEARCHER_PROPOSAL_ID + "/" + id);
    }


}
