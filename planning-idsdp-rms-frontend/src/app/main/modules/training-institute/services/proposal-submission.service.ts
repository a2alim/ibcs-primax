import {Injectable} from '@angular/core';
import {environment} from "../../../../../environments/environment";
import {HttpClient} from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class ProposalSubmissionService {

    baseTiEndPoint = environment.ibcs.rpmBackend;

    constructor(private http: HttpClient) {
    }

    getProposalSubmissionDates() {
        return this.http.get<any>(this.baseTiEndPoint + 'api/fyw-sector-sub-sector/get/available/fiscal-year');
    }

}
