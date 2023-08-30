import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CrudRequestService } from 'app/main/core/services/crud-request.service';
import { map } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { DppAnnualPhasingCostConstant } from '../constants/dpp-annual-phasing-cost.constant';
import { MtbfModel } from '../models/mtbf-model.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MtbfService extends CrudRequestService<MtbfModel> {
    private BASE_API_URL: string = DppAnnualPhasingCostConstant.DPP_ANNUAL_PHASING_COST;

    constructor(private http: HttpClient) {
        super(http, DppAnnualPhasingCostConstant.DPP_ANNUAL_PHASING_COST)
    }

    getByProjectConceptUuid(pcUuid: string) {
        const url: string = environment.ibcs.ppsDppBackendPoint + DppAnnualPhasingCostConstant.GET_MTBF_BY_PCUUID + '/' + pcUuid;
        return this.http.get(url).pipe(map((res: any) => {
            return res;
        }));
    }

    createMtbf(mtbFmodel: any, mtbfFiscalYearListData: any): Observable<any> {
        const data = {
            projectConceptId: mtbFmodel.projectConceptId,
            projectConceptUuid: mtbFmodel.projectConceptUuid,
            numberOfOngoingProject: mtbFmodel.numberOfOngoingProject,
            costOfApprovedProject: mtbFmodel.costOfApprovedProject,
            cumulativeExpenditure: mtbFmodel.cumulativeExpenditure,
            allocationRequiredForOngoingProject: mtbFmodel.allocationRequiredForOngoingProject,
            allocationInCurrentFiscalYear: mtbFmodel.allocationInCurrentFiscalYear,
            numberOfApprovedProject: mtbFmodel.numberOfApprovedProject,
            numberOfRecommendedProject: mtbFmodel.numberOfRecommendedProject,
            wayOfFinancing: mtbFmodel.wayOfFinancing,

            mtbfFiscalYearDetailList: mtbfFiscalYearListData,
        };

        const url: string = environment.ibcs.ppsDppBackendPoint + 'dpp-mtbf/create';
        return this.http.post(url, data).pipe(map((res: any) => {
            return res;
        }));
    }

    updateMtbf(mtbFmodel: any, mtbfFiscalYearListData: any): Observable<any> {
        const data = {
            uuid: mtbFmodel.uuid,
            projectConceptId: mtbFmodel.projectConceptId,
            projectConceptUuid: mtbFmodel.projectConceptUuid,
            numberOfOngoingProject: mtbFmodel.numberOfOngoingProject,
            costOfApprovedProject: mtbFmodel.costOfApprovedProject,
            cumulativeExpenditure: mtbFmodel.cumulativeExpenditure,
            allocationRequiredForOngoingProject: mtbFmodel.allocationRequiredForOngoingProject,
            allocationInCurrentFiscalYear: mtbFmodel.allocationInCurrentFiscalYear,
            numberOfApprovedProject: mtbFmodel.numberOfApprovedProject,
            numberOfRecommendedProject: mtbFmodel.numberOfRecommendedProject,
            wayOfFinancing: mtbFmodel.wayOfFinancing,

            mtbfFiscalYearDetailList: mtbfFiscalYearListData,
        };

        const url: string = environment.ibcs.ppsDppBackendPoint + 'dpp-mtbf/update';
        return this.http.put(url, data).pipe(map((res: any) => {
            return res;
        }));
    }
}

