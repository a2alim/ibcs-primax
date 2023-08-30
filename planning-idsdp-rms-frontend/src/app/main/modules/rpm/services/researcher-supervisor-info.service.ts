import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {CrudRequestService} from 'app/main/core/services/crud-request.service';
import {GET_BY_RESEARCHER_PROPOSAL_ID} from "../contants/researcher-proposal-info.constant";
import {Observable} from "rxjs";
import {CoreResponse} from "../../../core/models/response";
import {RESEARCHER_SUPERVISOR_INFO} from "../contants/researcher-supervisor-info.constant";
import {ResearcherSupervisorInformation} from "../models/ResearcherSupervisorInformation";

@Injectable({
  providedIn: 'root'
})
export class ResearcherSupervisorInfoService extends CrudRequestService {


  constructor(private http: HttpClient) {
      super(http, RESEARCHER_SUPERVISOR_INFO);
  }

    /**
     * Get by Researcher Proposal Id
     * @param id
     */
    getByResearcherProposalId(id: number): Observable<CoreResponse<ResearcherSupervisorInformation>> {
        return this.http.get<CoreResponse<ResearcherSupervisorInformation>>(this._BASE_URL + GET_BY_RESEARCHER_PROPOSAL_ID + "/" + id);
    }


}
