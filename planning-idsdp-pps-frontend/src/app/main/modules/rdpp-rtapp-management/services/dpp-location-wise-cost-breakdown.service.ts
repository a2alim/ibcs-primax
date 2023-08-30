import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CrudRequestService} from '../../../core/services/crud-request.service';
import {Observable} from 'rxjs';
import {
    IDppLocationWiseCostBreakdown
} from '../models/dpp-location-wise-cost-breakdown.model';
import {
    CREATE_LIST,
    DPP_LOCATION_WISE_COST_BREAKDOWN,
    GET_BY_PROJECT_CONCEPT_MASTER_ID, RDPP_LOCATION_WISE_COST_BREAKDOWN,
    UPDATE_LIST
} from '../constants/dpp-location-wise-cost-breakdown.constant';
import {RdppRtappManagementModule} from "../rdpp-rtapp-management.module";

@Injectable({
    providedIn: 'root'
})
export class DppLocationWiseCostBreakdownService extends CrudRequestService<IDppLocationWiseCostBreakdown> {

    constructor(private http: HttpClient) {
        super(http, RDPP_LOCATION_WISE_COST_BREAKDOWN);
    }

    createList(list: IDppLocationWiseCostBreakdown[]): Observable<IDppLocationWiseCostBreakdown[]> {
        return this.http.post<IDppLocationWiseCostBreakdown[]>(this._BASE_URL + CREATE_LIST, list);
    }

    updateList(list: IDppLocationWiseCostBreakdown[]): Observable<IDppLocationWiseCostBreakdown[]> {
        return this.http.post<IDppLocationWiseCostBreakdown[]>(this._BASE_URL + UPDATE_LIST, list);
    }

    getByProjectConceptMasterId(projectConceptMasterId: number): Observable<IDppLocationWiseCostBreakdown[]> {
        return this.http.get<IDppLocationWiseCostBreakdown[]>(this._BASE_URL + GET_BY_PROJECT_CONCEPT_MASTER_ID + "/" + projectConceptMasterId);
    }

    getRdppByProjectConceptMasterId(projectConceptMasterId: number): Observable<IDppLocationWiseCostBreakdown[]> {
        return this.http.get<IDppLocationWiseCostBreakdown[]>(DPP_LOCATION_WISE_COST_BREAKDOWN + GET_BY_PROJECT_CONCEPT_MASTER_ID + "/" + projectConceptMasterId);
    }

}
