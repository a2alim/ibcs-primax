import { Injectable } from '@angular/core';
import {CrudRequestService} from "../../../core/services/crud-request.service";
import {IProjectLocation} from "../../project-concept-management/models/project-location";
import {environment} from "../../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {
    GET_BY_OBJECTIVE_AND_COST_ID_USING_PROJECT_SUMMARY,
    GET_BY_PROJECT_SUMMARY_ID,
    LOCATION, LOCATION_RDPP
} from "../constants/dpp-location.constant";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class RdppLocationService extends CrudRequestService<IProjectLocation> {

    private BASE_API_URL: string = environment.ibcs.configurationApiEndPoint;

    constructor(private http: HttpClient) {
        super(http, LOCATION_RDPP);
    }

    getByRdppMasterId(rdppMasterId: number): Observable<any> {
        return this.http.get<any>(this._BASE_URL + GET_BY_OBJECTIVE_AND_COST_ID_USING_PROJECT_SUMMARY + '/' + rdppMasterId);
    }

    getByRdppLocation(rdppMasterId: number): Observable<any> {
        return this.http.get<any>(this._BASE_URL + GET_BY_PROJECT_SUMMARY_ID + '/' + rdppMasterId);
    }

    getLocationByObjectiveCostIdUsingProjectSummary(id: number): Observable<any> {
        return this.http.get<any>(this._BASE_URL + GET_BY_OBJECTIVE_AND_COST_ID_USING_PROJECT_SUMMARY + '/' + id);
    }

}
