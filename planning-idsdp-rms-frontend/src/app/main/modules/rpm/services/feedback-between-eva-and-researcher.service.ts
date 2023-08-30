import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CrudRequestService } from 'app/main/core/services/crud-request.service';
import { environment } from 'environments/environment';
import { Observable } from "rxjs";
import { CoreResponse } from "../../../core/models/response";
import { FIND_ALL_BY_RESEARCHER_PRESENTATION_ID, FIND_EVALUATOR_BY_SEMINAR_ID, FIND_USER_BY_USER_ID, PRESENTATION_REPORT } from "../contants/presentation-report.constant";
import { PresentationReport } from "../models/PresentationReport";
import { FEEDBACK_BETWEEN_EVALUATOR_AND_RESEARCHER } from "../contants/feedback-between-evaluator-and-researcher.constant";
import { FeedbackBetweenEvaluatorAndResearcher } from "../models/FeedbackBetweenEvaAndResearcher";
import { UserModel } from '../models/user-model';

@Injectable({
    providedIn: 'root'
})
export class FeedbackBetweenEvaluatorAndResearcherService extends CrudRequestService {

    baseRmsConfigurationApiEndPoint = environment.ibcs.rpmBackend;

    constructor(private http: HttpClient) {
        super(http, FEEDBACK_BETWEEN_EVALUATOR_AND_RESEARCHER);
    }

    findAllByResearcherPresentationId(researcherPresentationId: number): Observable<CoreResponse<FeedbackBetweenEvaluatorAndResearcher>> {
        return this.http.get<CoreResponse<FeedbackBetweenEvaluatorAndResearcher>>(this._BASE_URL + FIND_ALL_BY_RESEARCHER_PRESENTATION_ID + "/" + researcherPresentationId);
    }

    findUserByUserId(userId: number): Observable<CoreResponse<UserModel>> {
        return this.http.get<CoreResponse<UserModel>>(this._BASE_URL + FIND_USER_BY_USER_ID + "/" + userId);
    }

    findEvaluatorBySeminarId(seminarId : number): Observable<CoreResponse<any>>{
        return this.http.get<CoreResponse<any>>(this._BASE_URL + FIND_EVALUATOR_BY_SEMINAR_ID + "/" + seminarId);
    }

    findEvaluatorByResearcherProposal(researcherProposalId : number): Observable<CoreResponse<any>>{
        return this.http.get<CoreResponse<any>>(this._BASE_URL + "find-evaluator-by-researcher-proposal-id" + "/" + researcherProposalId);
    }

    

}
