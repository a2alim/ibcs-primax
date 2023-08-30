import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {CrudRequestService} from 'app/main/core/services/crud-request.service';
import {environment} from 'environments/environment';
import {Observable} from "rxjs";
import {CoreResponse} from "../../../core/models/response";
import {
    EVALUATOR_NEWMEMBER_ATTENDANCE,
    FIND_ALL_BY_RESEARCHER_PROPOSAL,
    GET_BY_RESEARCHER_PRESENTATION_ID
} from "../contants/evaluator-newmember-attendance.constant";
import {EvaluatorNewMemberAttendance} from "../models/EvaluatorNewMemberAttendance";

@Injectable({
    providedIn: 'root'
})
export class EvaluatorNewmemberAttendanceService extends CrudRequestService {

    baseRmsConfigurationApiEndPoint = environment.ibcs.rpmBackend;

    constructor(private http: HttpClient) {
        super(http, EVALUATOR_NEWMEMBER_ATTENDANCE);
    }

    findAllByResearcherProposalId(proposal: string): Observable<CoreResponse<EvaluatorNewMemberAttendance>> {
        return this.http.get<CoreResponse<EvaluatorNewMemberAttendance>>(this._BASE_URL + FIND_ALL_BY_RESEARCHER_PROPOSAL + "/" + proposal);
    }

    getByResearcherPresentationId(researcherPresentationId: number): Observable<CoreResponse<EvaluatorNewMemberAttendance>> {
        return this.http.get<CoreResponse<EvaluatorNewMemberAttendance>>(this._BASE_URL + GET_BY_RESEARCHER_PRESENTATION_ID + "/" + researcherPresentationId);
    }

}
