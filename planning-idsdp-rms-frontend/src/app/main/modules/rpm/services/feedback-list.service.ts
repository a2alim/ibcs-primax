import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CrudRequestService } from 'app/main/core/services/crud-request.service';
import { environment } from 'environments/environment';
import { Observable } from "rxjs";
import { CoreResponse } from "../../../core/models/response";
import {
    FIND_ALL_BY_ST_FISCAL_YEAR_ID,
    FIND_ALL_BY_ST_FISCAL_YEAR_ID_AND_PROFILE_ID,
    RESEARCHER_GRID_LIST,
    RESEARCHER_LIST,
    VIEW_RESEARCHER_PROFILE_BY_ID,
    VIEW_RESERCHER_PROFILE
} from '../contants/researcher-list.constant';
import {
    GET_BY_FISCAL_YEAR_ID,
    GET_BY_PROFILE_UUID,
    GET_BY_RESEARCHER_PROFILE_INFO_ID_GRID_LIST, GET_BY_ST_FISCAL_YEAR_ID, GET_LIST_FIND_BY_STFISCAL_YEAR_ID,
    GET_RESEARCHER_PROPOSAL_DETAILS_BY_UUID,
    RESEARCHER_PROPOSAL
} from "../contants/researcher-proposal.constant";
import { ResearcherProposal } from "../models/ResearcherProposal";

@Injectable({
    providedIn: 'root'
})
export class FeedbackListService extends CrudRequestService {

    baseRmsConfigurationApiEndPoint = environment.ibcs.rpmBackend;

    constructor(private http: HttpClient) {
        super(http, RESEARCHER_LIST);
    }

    getFeedbackGridList(data: any): Observable<any> {
        return this.http.post<CoreResponse<any>>(environment.ibcs.rpmBackend + 'api/presentation-evaluators-feedback' + `/feedback-list-group-by-researcher-proposal`, data);
    }

    findFiscalYear() {
        return this.http.get<CoreResponse<any>>(environment.ibcs.rpmBackend + 'api/presentation-evaluators-feedback' + `/find-fiscal-year`);
    }

    findResearchTittle(fiscalYearId) {
        return this.http.get<CoreResponse<any>>(environment.ibcs.rpmBackend + 'api/presentation-evaluators-feedback' + `/find-research-tittle/${fiscalYearId}`);
    }

    findResearcherName(researcherProposalId) {
        return this.http.get<CoreResponse<any>>(environment.ibcs.rpmBackend + 'api/presentation-evaluators-feedback' + `/find-researcher-name/${researcherProposalId}`);
    }




}
