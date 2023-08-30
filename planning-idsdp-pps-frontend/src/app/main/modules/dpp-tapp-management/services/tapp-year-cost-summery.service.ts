import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CrudRequestService} from '../../../core/services/crud-request.service';
import {environment} from '../../../../../environments/environment';
import {TappYearCostSummeryModel} from '../models/tappYearCostSummery.model';
import {Observable} from "rxjs";
import {GET_BY_PROJECT_SUMMARY_UUID, YEAR_COST_SUMMERY} from "../constants/tapp-year-cost-summery.constant";

@Injectable({
  providedIn: 'root'
})
export class TappYearCostSummeryService extends CrudRequestService<TappYearCostSummeryModel>{

    constructor(private http: HttpClient) {
        super(http, YEAR_COST_SUMMERY);
    }

    getYearCostSummeryByProjectSummaryUuid(projectSummaryId: number): Observable<any> {
        return this.http.get<any>(this._BASE_URL + GET_BY_PROJECT_SUMMARY_UUID + '/' + projectSummaryId);
    }
}
