import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {CrudRequestService} from 'app/main/core/services/crud-request.service';
import {environment} from 'environments/environment';
import {Observable} from "rxjs";
import {CoreResponse} from "../../../core/models/response";
import {FIND_ALL_BY_RESEARCHER_PRESENTATION_ID, NEW_MEMBER} from "../contants/new-member.constant";
import {NewMember} from "../models/NewMember";

@Injectable({
    providedIn: 'root'
})
export class NewMemberService extends CrudRequestService {

    baseRmsConfigurationApiEndPoint = environment.ibcs.rpmBackend;

    constructor(private http: HttpClient) {
        super(http, NEW_MEMBER);
    }

    findAllByResearcherPresentationId(researcherPresentationId: number): Observable<CoreResponse<NewMember>> {
        return this.http.get<CoreResponse<NewMember>>(this._BASE_URL + FIND_ALL_BY_RESEARCHER_PRESENTATION_ID + "/" + researcherPresentationId);
    }

}
