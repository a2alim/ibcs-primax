import { Injectable } from '@angular/core';
import {CrudRequestService} from '../../../core/services/crud-request.service';
import {CostBenefitAnalysisModel} from '../models/cost-benefit-analysis.model';
import {HttpClient} from '@angular/common/http';
import {COST_BENEFIT_ANALYSIS} from '../constants/cost-benefit-analysis.constant';
import {environment} from '../../../../../environments/environment';
import {map} from 'rxjs/operators';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CostBenefitAnalysisService extends CrudRequestService<CostBenefitAnalysisModel> {
    private subject = new Subject<any>();

  constructor(private http: HttpClient) {
      super(http, COST_BENEFIT_ANALYSIS);
  }

    feasibilitySummarySaveClickEvent(){
        this.subject.next();
    }

    // for get ProjectSummary Save Event
    getFeasibilitySummarySaveEvent():Observable<any>{
        return this.subject.asObservable();
    }

    // tslint:disable-next-line:max-line-length
    createCostBenefitAnalysis(financialAnalysis: any, financialNetPresentVal: any, financialBenefitCostRatio: any, financialInternalRateReturn: any, economicAnalysis: any, economicNetPresentVal: any, economicBenefitCostRatio: any, economicInternalRateReturn: any, file: File, fsrMasterId: any) {
        const formData = new FormData();
        formData.append('financialAnalysis', financialAnalysis);
        formData.append('financialNetPresentVal', financialNetPresentVal);
        formData.append('financialBenefitCostRatio', financialBenefitCostRatio);
        formData.append('financialInternalRateReturn', financialInternalRateReturn);
        formData.append('economicAnalysis', economicAnalysis);
        formData.append('economicNetPresentVal', economicNetPresentVal);
        formData.append('economicBenefitCostRatio', economicBenefitCostRatio);
        formData.append('economicInternalRateReturn', economicInternalRateReturn);
        formData.append('attachmentFile', file);
        formData.append('fsrMasterId', fsrMasterId);

        const url: string = environment.ibcs.ppsFsBaseEndPoint + 'cost-benefit-analysis/createCostBenefitAnalysis';
        return this.http.post(url, formData, {observe: 'response' as 'body'}).pipe(map((res: any) => {
            return res;
        }));
    }

    getCostBenefitAnalysisByPcUuid(fsrMasterId: number): any {
        const url: string = environment.ibcs.ppsFsBaseEndPoint + 'cost-benefit-analysis/getCostBenefitAnalysisList' + '/' + fsrMasterId;
        return this.http.get(url).pipe(map((res: any) => {
            return res;
        }));
    }

    // tslint:disable-next-line:max-line-length
    updateCostBenefitAnalysis(financialAnalysis: any, financialNetPresentVal: any, financialBenefitCostRatio: any, financialInternalRateReturn: any, economicAnalysis: any, economicNetPresentVal: any, economicBenefitCostRatio: any, economicInternalRateReturn: any, file: File, fsrMasterId: any) {
        const formData = new FormData();
        formData.append('financialAnalysis', financialAnalysis);
        formData.append('financialNetPresentVal', financialNetPresentVal);
        formData.append('financialBenefitCostRatio', financialBenefitCostRatio);
        formData.append('financialInternalRateReturn', financialInternalRateReturn);
        formData.append('economicAnalysis', economicAnalysis);
        formData.append('economicNetPresentVal', economicNetPresentVal);
        formData.append('economicBenefitCostRatio', economicBenefitCostRatio);
        formData.append('economicInternalRateReturn', economicInternalRateReturn);
        formData.append('attachmentFile', file);
        formData.append('fsrMasterId', fsrMasterId);

        const url: string = environment.ibcs.ppsFsBaseEndPoint + 'cost-benefit-analysis/updateCostBenefitAnalysis';
        return this.http.put(url, formData, {observe: 'response' as 'body'}).pipe(map((res: any) => {
            return res;
        }));
    }
}
