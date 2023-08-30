import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CrudRequestService } from 'app/main/core/services/crud-request.service';
import { environment } from 'environments/environment';
import { Observable } from "rxjs";
import { CoreResponse } from "../../../core/models/response";
import {
    GET_BY_FISCAL_YEAR_ID,
    GET_BY_PROFILE_UUID,
    GET_BY_RESEARCHER_PROFILE_INFO_ID_GRID_LIST, GET_BY_ST_FISCAL_YEAR_ID, GET_LIST_FIND_BY_STFISCAL_YEAR_ID,
    GET_RESEARCHER_PROPOSAL_DETAILS_BY_UUID,
    RESEARCHER_PROPOSAL,
    RESEARCH_INFORMATION,
    UPDATE_APPROVAL_STATUS,
    UPDATE_FINAL_SUBMIT_STATUS
} from "../contants/researcher-proposal.constant";
import { ResearcherProposal } from "../models/ResearcherProposal";

@Injectable({
    providedIn: 'root'
})
export class ResearcherProposalService extends CrudRequestService {

    baseRmsConfigurationApiEndPoint = environment.ibcs.rpmBackend;
    
    constructor(private http: HttpClient) {
        super(http, RESEARCHER_PROPOSAL);
    }

    getResearcherProposalDetailsByUuid(uuid: string): Observable<CoreResponse<any>> {
        return this.http.get<CoreResponse<any>>(this._BASE_URL + GET_RESEARCHER_PROPOSAL_DETAILS_BY_UUID + "/" + uuid);
    }

    getResearcherProfileByUuId(uuid: string): Observable<CoreResponse<any>> {
        return this.http.get<CoreResponse<any>>(this._BASE_URL + GET_BY_PROFILE_UUID + "/" + uuid);
    }

    getListFindByResProfilePersonalInfoId(offset: number, pageSize: number, resProfilePersonalInfoId: number): Observable<CoreResponse<any>> {
        return this.http.get<CoreResponse<any>>(this._BASE_URL + GET_BY_RESEARCHER_PROFILE_INFO_ID_GRID_LIST + "/" + offset + "/" + pageSize + "/" + resProfilePersonalInfoId);
    }

    getListFindByStFiscalYearId(data: any): Observable<CoreResponse<any>> {
        return this.http.post<CoreResponse<any>>(this._BASE_URL + GET_BY_ST_FISCAL_YEAR_ID, data);
    }

    getByFiscalYearId(fiscalYearId: number): Observable<CoreResponse<ResearcherProposal>> {
        return this.http.get<CoreResponse<ResearcherProposal>>(this._BASE_URL + GET_BY_FISCAL_YEAR_ID + '/' + fiscalYearId);
    }

    updateApprovalStatus(data: any): Observable<CoreResponse<ResearcherProposal>> {
        return this.http.post<CoreResponse<any>>(this._BASE_URL + UPDATE_APPROVAL_STATUS, data);
    }

    getResearchInformation(researchUuid: string) {
        return this.http.get<CoreResponse<ResearcherProposal>>(this._BASE_URL + RESEARCH_INFORMATION + '/' + researchUuid);
    }

    updateFinalSubmitStatus(data: any): Observable<CoreResponse<ResearcherProposal>> {
        return this.http.post<CoreResponse<any>>(this._BASE_URL + UPDATE_FINAL_SUBMIT_STATUS, data);
    }

    getActiveCircularData(fiscalYearId: string) {
        let baseUrl = environment.ibcs.rpmBackend + 'api/fyw-sector-sub-sector/';
        return this.http.get<CoreResponse<ResearcherProposal>>(baseUrl + 'get-request-letters/' + fiscalYearId);
    }

}
