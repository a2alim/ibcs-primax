import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {CrudRequestService} from 'app/main/core/services/crud-request.service';
import {environment} from 'environments/environment';
import {Observable} from "rxjs";
import {CoreResponse} from "../../../core/models/response";
import {
    FIND_BY_RESEARCHER_PROPOSAL_ID,
    GET_BY_SEMINAR_ID,
    RESEARCH_TITLE_LIST,
    RESEARCHER_PRESENTATION
} from "../contants/researcher-presentation.constant";
import {ResearcherPresentation} from "../models/ResearcherPresentation";

@Injectable({
    providedIn: 'root'
})
export class ResearcherPresentationService extends CrudRequestService {

    baseRmsConfigurationApiEndPoint = environment.ibcs.rpmBackend;

    constructor(private http: HttpClient) {
        super(http, RESEARCHER_PRESENTATION);
    }

    getResearchTittleListFindBySeminarUuid(createSeminarUuid: string): Observable<CoreResponse<any>> {
        return this.http.get<CoreResponse<any>>(this._BASE_URL + RESEARCH_TITLE_LIST + "/" + createSeminarUuid);
    }

    findByResearcherProposalId(researcherProposalId: number): Observable<CoreResponse<ResearcherPresentation>> {
        return this.http.get<CoreResponse<ResearcherPresentation>>(this._BASE_URL + FIND_BY_RESEARCHER_PROPOSAL_ID + "/" + researcherProposalId);
    }

    getResearchPresentationBySeminarUuid(createSeminarUuid: string): Observable<CoreResponse<ResearcherPresentation>> {
        return this.http.get<CoreResponse<ResearcherPresentation>>(this._BASE_URL + GET_BY_SEMINAR_ID + "/" + createSeminarUuid);
    }

}
