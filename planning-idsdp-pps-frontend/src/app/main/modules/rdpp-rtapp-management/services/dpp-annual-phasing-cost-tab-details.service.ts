import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CrudRequestService} from '../../../core/services/crud-request.service';
import {IDppAnnualPhasingCostTabDetails} from '../models/dpp-annual-phasing-cost-tab-details';
import {DppAnnualPhasingCostTabDetailsConstant} from '../constants/dpp-annual-phasing-cost-tab-details.constant';
import {RdppRtappManagementModule} from "../rdpp-rtapp-management.module";

@Injectable({
    providedIn: 'root'
})
export class DppAnnualPhasingCostTabDetailsService extends CrudRequestService<IDppAnnualPhasingCostTabDetails> {

    constructor(private http: HttpClient) {
        super(http, DppAnnualPhasingCostTabDetailsConstant.DPP_ANNUAL_PHASING_COST_TAB_DETAILS)
    }

    getByProjectConceptIdAndIsBasisOrIsMajor(pcId: number, isBasis: boolean, isMajor: boolean): Observable<IDppAnnualPhasingCostTabDetails[]> {
        return this.http.get<IDppAnnualPhasingCostTabDetails[]>(this._BASE_URL + DppAnnualPhasingCostTabDetailsConstant.GET_ALL_BY_PROJECT_CONCEPT_ID_AND_IS_BASIS_OR_IS_MAJOR + "/" + pcId + "/" + isBasis + "/" + isMajor);
    }
}
