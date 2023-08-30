import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {FinancialAnalysisUrlConstant} from '../constants/financial-analysis.url.constant';
import {map} from "rxjs/operators";
import {RdppFinancialAnalysis} from "../../../../models/rdpp-financial-analysis.model";

@Injectable({
    providedIn: 'root'
})
export class FinancialAnalysisService {

    constructor(private _http: HttpClient) {
    }

    saveFinancialAnalysis(financialAnalysis: RdppFinancialAnalysis): any {
        return this._http.post(FinancialAnalysisUrlConstant.CREATE_FINANCIAL_ANALYSIS, financialAnalysis)
    }

    updateFinancialAnalysis(financialAnalysis: RdppFinancialAnalysis, projectId: string): any {
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
}
