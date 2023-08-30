import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {CrudRequestService} from 'app/main/core/services/crud-request.service';
import {GET_BY_RESEARCHER_PROPOSAL_ID, RESEARCHER_PROPOSAL_INFO} from "../contants/researcher-proposal-info.constant";
import {ResearcherProposalInformation} from "../models/ResearcherProposalInformation";
import {Observable} from "rxjs";
import {CoreResponse} from "../../../core/models/response";

@Injectable({
  providedIn: 'root'
})
export class ResearcherProposalInfoService extends CrudRequestService {


  constructor(private http: HttpClient) {
      super(http, RESEARCHER_PROPOSAL_INFO);
  }

    /**
     * Get by Researcher Proposal Id
     * @param id
     */
    getByResearcherProposalId(id: number): Observable<CoreResponse<ResearcherProposalInformation>> {
        return this.http.get<CoreResponse<ResearcherProposalInformation>>(this._BASE_URL + GET_BY_RESEARCHER_PROPOSAL_ID + "/" + id);
    }


}
