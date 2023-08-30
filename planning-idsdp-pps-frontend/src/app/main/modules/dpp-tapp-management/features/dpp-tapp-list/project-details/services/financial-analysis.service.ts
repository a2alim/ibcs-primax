import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FinancialAnalysisUrlConstant } from '../constants/financial-analysis.url.constant';
import { FinancialAnalysis } from '../models/financial-analysis.model';
import { map } from "rxjs/operators";
import { CalFinancialAnalysisParent } from '../models/cal-financial-analysis-parent.model';

@Injectable({
    providedIn: 'root'
})
export class FinancialAnalysisService {

    constructor(private _http: HttpClient) {
    }

    saveFinancialAnalysis(financialAnalysis: FinancialAnalysis): any {
        return this._http.post(FinancialAnalysisUrlConstant.CREATE_FINANCIAL_ANALYSIS, financialAnalysis)
    }

    updateFinancialAnalysis(financialAnalysis: FinancialAnalysis, projectId: string): any {
        return this._http.put(FinancialAnalysisUrlConstant.UPDATE_FINANCIAL_ANALYSIS + '/' + projectId, financialAnalysis)
    }

    getFinancialAnalysis(projectId) {
        return this._http.get(FinancialAnalysisUrlConstant.GET_FINANCIAL_ANALYSIS + '/' + projectId).pipe(map((res: any) => {
            return res;
        }));
    }

    updateEffectImpact(projectId, model) {
        return this._http.put(FinancialAnalysisUrlConstant.UPDATE_FINANCIAL_ANALYSIS + '/' + projectId, model).pipe(map((res: any) => {
            return res;
        }));
    }

    saveFiles(financialAnalysisId: number, financialAnalysisAttachment): Observable<any> {
        const formData = new FormData();
        formData.append('summaryFindingAttachment', financialAnalysisAttachment.summaryFindingAttachment);
        formData.append('financialAttachment', financialAnalysisAttachment.financialAttachment);
        formData.append('economicAttachment', financialAnalysisAttachment.economicAttachment);
        formData.append('financialAnalysisId', financialAnalysisId.toString());
        return this._http.post(FinancialAnalysisUrlConstant.ADD_FINANCIAL_ANALYSIS_ATTACHMENT, formData);
    }

    saveFinancialAnalysisCalculation(data: CalFinancialAnalysisParent): any {
        return this._http.post(FinancialAnalysisUrlConstant.CREATE_FINANCIAL_ANALYSIS_CALCULATION, data).pipe(map((res: any) => res));
    }

    getByProjectConceptMasterId(projectConceptMasterId, calculationType): any {
        const params = new HttpParams().append('projectConceptMasterId', projectConceptMasterId).append('calculationType', calculationType);
        return this._http.get(FinancialAnalysisUrlConstant.GET_FINANCIAL_ANALYSIS_CALCULATION, { params }).pipe(map((res: any) => res));
    }

}
