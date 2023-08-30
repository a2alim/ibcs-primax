import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CrudRequestService } from 'app/main/core/services/crud-request.service';
import { environment } from 'environments/environment';
import { Observable } from "rxjs";
import { CoreResponse } from "../../../core/models/response";
import { FIND_ALL_BY_CREATE_SEMINAR_UUID, FIND_ALL_BY_RESEARCHER_PRESENTATION_ID, PRESENTATION_REPORT } from "../contants/presentation-report.constant";
import { PresentationReport } from "../models/PresentationReport";

@Injectable({
    providedIn: 'root'
})
export class PresentationReportService extends CrudRequestService {

    baseRmsConfigurationApiEndPoint = environment.ibcs.rpmBackend;

    constructor(private http: HttpClient) {
        super(http, PRESENTATION_REPORT);
    }

    findAllByResearcherPresentationId(researcherPresentationId: number): Observable<CoreResponse<PresentationReport>> {
        return this.http.get<CoreResponse<PresentationReport>>(this._BASE_URL + FIND_ALL_BY_RESEARCHER_PRESENTATION_ID + "/" + researcherPresentationId);
    }

    findAllByCreateSeminarUuid(createSeminarUuid: string) {
        return this.http.get<CoreResponse<PresentationReport>>(this._BASE_URL + FIND_ALL_BY_CREATE_SEMINAR_UUID + "/" + createSeminarUuid);
    }


    seminarIsExists(seminarId: number) {
        const url = this._BASE_URL + 'seminar-is-exists/' + seminarId;
        return this.http.get<Boolean>(url);
    }

}
