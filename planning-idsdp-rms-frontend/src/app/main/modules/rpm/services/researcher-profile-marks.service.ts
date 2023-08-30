import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {CrudRequestService} from 'app/main/core/services/crud-request.service';
import {environment} from 'environments/environment';
import {Observable} from "rxjs";
import {CoreResponse} from "../../../core/models/response";
import {ResearcherProfileMarks} from "../models/ResearcherProfileMarks";
import {
    GET_BY_RESEARCHER_PROPOSAL_ID_AND_CATEGORY_ID,
    RESEARCHER_PROFILE_MARKS
} from "../contants/researcher-profile-marks.constant";

@Injectable({
    providedIn: 'root'
})
export class ResearcherProfileMarksService extends CrudRequestService {

    baseRmsConfigurationApiEndPoint = environment.ibcs.rpmBackend;

    constructor(private http: HttpClient) {
        super(http, RESEARCHER_PROFILE_MARKS);
    }

    getResearcherProfileByIdAndCategory(id: number, categoryId: number): Observable<CoreResponse<ResearcherProfileMarks>> {
        return this.http.get<CoreResponse<ResearcherProfileMarks>>(this._BASE_URL + GET_BY_RESEARCHER_PROPOSAL_ID_AND_CATEGORY_ID + "/" + id + "/" + categoryId);
    }

}
