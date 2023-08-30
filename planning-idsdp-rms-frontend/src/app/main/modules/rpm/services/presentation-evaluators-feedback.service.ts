import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CrudRequestService } from 'app/main/core/services/crud-request.service';
import { environment } from 'environments/environment';
import { Observable } from "rxjs";
import { CoreResponse } from "../../../core/models/response";
import {
    FIND_ALL_BY_RESEARCHER_PROPOSAL_UUID,
    FIND_ALL_NEW_FEEDBACK_BY_RESEARCHER_PROPOSAL_UUID,
    FIND_BY_RESEARCHER_PRESENTATION_AND_RESEARCHER_PROPOSAL_AND_EXPERT_EVALUATOR_OR_NEWMEMBER,
    FIND_EVALUATOR_BY_SEMINAR_ID,
    FIND_SEMINAR_PRESENTATION_REPORT_BY_SEMINAR_ID,
    GET_BY_RESEARCHER_PRESENTATION_ID,
    PRESENTATION_EVALUATORS_FEEDBACK,
    RESEARCHER_FEEDBACK
} from "../contants/presentation-evaluators-feedback.constant";
import { ViewPresentationEvaluatorsFeedback } from "../models/ViewPresentationEvaluatorsFeedback";
import { PresentationEvaluatorsFeedback } from "../models/PresentationEvaluatorsFeedback";

@Injectable({
    providedIn: 'root'
})
export class PresentationEvaluatorsFeedbackService extends CrudRequestService {

    baseRmsConfigurationApiEndPoint = environment.ibcs.rpmBackend;

    constructor(private http: HttpClient) {
        super(http, PRESENTATION_EVALUATORS_FEEDBACK);
    }

    findEvaluatorBySeminarId(seminarId: number): Observable<CoreResponse<ViewPresentationEvaluatorsFeedback>> {
        return this.http.get<CoreResponse<ViewPresentationEvaluatorsFeedback>>(this._BASE_URL + FIND_EVALUATOR_BY_SEMINAR_ID + "/" + seminarId);
    }

    getByResearcherPresentationId(researcherPresentationId: number): Observable<CoreResponse<PresentationEvaluatorsFeedback>> {
        return this.http.get<CoreResponse<PresentationEvaluatorsFeedback>>(this._BASE_URL + GET_BY_RESEARCHER_PRESENTATION_ID + "/" + researcherPresentationId);
    }

    findAllByResearcherProposalId(uuid): Observable<CoreResponse<any>> {
        return this.http.get<CoreResponse<PresentationEvaluatorsFeedback>>(this._BASE_URL + "find-all-by-researcher-proposal-for-feedback-list" + "/" + uuid);
    }

    getAllByResearcherProposalUuid(researcherProposalUuid: string): Observable<CoreResponse<PresentationEvaluatorsFeedback>> {
        return this.http.get<CoreResponse<PresentationEvaluatorsFeedback>>(this._BASE_URL + FIND_ALL_BY_RESEARCHER_PROPOSAL_UUID + "/" + researcherProposalUuid);
    }

    getAllNewFeedbackByResearcherProposalUuid(researcherProposalUuid: string): Observable<CoreResponse<PresentationEvaluatorsFeedback>> {
        return this.http.get<CoreResponse<PresentationEvaluatorsFeedback>>(this._BASE_URL + FIND_ALL_NEW_FEEDBACK_BY_RESEARCHER_PROPOSAL_UUID + "/" + researcherProposalUuid);
    }

    researcherFeedback(data: {uuid: string, researcherFeedback: string, pageNo2: number, }[]): Observable<CoreResponse<PresentationEvaluatorsFeedback>> {
        return this.http.post<CoreResponse<PresentationEvaluatorsFeedback>>(this._BASE_URL + RESEARCHER_FEEDBACK, data);
    }

    findSeminarPresentationReport(seminarUuid: string): Observable<CoreResponse<PresentationEvaluatorsFeedback>> {
        return this.http.get<CoreResponse<PresentationEvaluatorsFeedback>>(this._BASE_URL + FIND_SEMINAR_PRESENTATION_REPORT_BY_SEMINAR_ID + "/" + seminarUuid);
    }

    getByResearcherPresentationIdAndProposalIdAndExpertEvaluatorOrNewMember(data: {m2ResearcherPresentationUuid: string, m1ResearcherProposalUuid: string, m2AddNewMemberUuid: string, stProfileOfExpertEvaluatorsId: number} ): Observable<CoreResponse<PresentationEvaluatorsFeedback>> {
        return this.http.post<CoreResponse<PresentationEvaluatorsFeedback>>(this._BASE_URL + FIND_BY_RESEARCHER_PRESENTATION_AND_RESEARCHER_PROPOSAL_AND_EXPERT_EVALUATOR_OR_NEWMEMBER, data);
    }


}
