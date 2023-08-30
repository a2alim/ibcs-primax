import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CrudRequestService } from 'app/main/core/services/crud-request.service';
import { environment } from 'environments/environment';
import { Observable, of } from "rxjs";
import { map, tap } from 'rxjs/operators';
import { CoreResponse } from "../../../core/models/response";
import {
    FIND_ALL_BY_ST_FISCAL_YEAR_ID,
    FIND_ALL_BY_ST_FISCAL_YEAR_ID_AND_PROFILE_ID,
    FIND_BY_FISCAL_YEAR_ID_AND_RESEARCH_CAT_ID,
    FIND_BY_KEY_WORD,
    RESEARCHER_GRID_LIST,
    RESEARCHER_LIST,
    RESEARCHER_LIST_PUBLIC,
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
export class ResearcherListService extends CrudRequestService {


    baseRmsConfigurationApiEndPoint = environment.ibcs.rpmBackend;

    constructor(private http: HttpClient) {
        super(http, RESEARCHER_LIST);
    }

    getResearcherGridList(data: any): Observable<any> {
        return this.http.post<CoreResponse<any>>(this._BASE_URL + RESEARCHER_GRID_LIST, data);
    }

    getResearcherGridListPublic(data: any): Observable<any> {
        return this.http.post<CoreResponse<any>>(RESEARCHER_LIST_PUBLIC + RESEARCHER_GRID_LIST, data);
    }

    findAllByStFiscalYearId(stFiscalYearId: any) {
        return this.http.get<CoreResponse<any>>(this._BASE_URL + FIND_ALL_BY_ST_FISCAL_YEAR_ID + "/" + stFiscalYearId);
    }

    findAllByStFiscalYearIdAndProfileId(data: any) {
        return this.http.post<CoreResponse<any>>(this._BASE_URL + FIND_ALL_BY_ST_FISCAL_YEAR_ID_AND_PROFILE_ID, data);
    }

    resercherProfileDate(uuId: string) {
        return this.http.get<CoreResponse<any>>(this._BASE_URL + VIEW_RESERCHER_PROFILE + "/" + uuId);
    }

    researcherProfileDateById(id: number) {
        return this.http.get<CoreResponse<any>>(this._BASE_URL + VIEW_RESEARCHER_PROFILE_BY_ID + "/" + id);
    }

    opts = [];
    findByKeyWord(data: any) {      
        return this.http.post<any>(RESEARCHER_LIST_PUBLIC + FIND_BY_KEY_WORD, data).pipe(map((data: any) => data.items)).pipe(tap(data => this.opts = data));
    }

    findResearchProposalListByFiscalYearAndResearchCatId(stFiscalYearId: any, stResearchCategoryTypeId:any) {
        return this.http.get<CoreResponse<any>>(environment.ibcs.rpmBackend + 'api/researcher-proposal'+ FIND_BY_FISCAL_YEAR_ID_AND_RESEARCH_CAT_ID + "/" + stFiscalYearId +"/"+ stResearchCategoryTypeId);
    }





}
