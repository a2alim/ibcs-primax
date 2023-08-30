import { Injectable } from '@angular/core';
import {environment} from '../../../../../environments/environment';
import {map} from 'rxjs/operators';
import {CrudRequestService} from '../../../core/services/crud-request.service';
import {RiskAnalysisModel} from '../models/risk-analysis.model';
import {HttpClient} from '@angular/common/http';
import {RISK_ANALYSIS} from '../constants/risk-analysis.constant';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RiskAnalysisService extends CrudRequestService<RiskAnalysisModel> {

    private subject = new Subject<any>();

  constructor(private http: HttpClient) {
      super(http, RISK_ANALYSIS);
  }

    feasibilitySummarySaveClickEvent(){
        this.subject.next();
    }

    // for get ProjectSummary Save Event
    getFeasibilitySummarySaveEvent():Observable<any>{
        return this.subject.asObservable();
    }

    createRiskAnalysis(envClimateChangeAnalysis: any, assessmentDisasterResilienceProject: any, file: File, fsrMasterId: any) {
        const formData = new FormData();
        formData.append('envClimateChangeAnalysis', envClimateChangeAnalysis);
        formData.append('assessmentDisasterResilienceProject', assessmentDisasterResilienceProject);
        formData.append('attachmentFile', file);
        formData.append('fsrMasterId', fsrMasterId);

        const url: string = environment.ibcs.ppsFsBaseEndPoint + 'risk-analysis/createRiskAnalysis';
        return this.http.post(url, formData, {observe: 'response' as 'body'}).pipe(map((res: any) => {
            return res;
        }));
    }

    getRiskAnalysisByPcUuid(fsrMasterId: number): any {
        const url: string = environment.ibcs.ppsFsBaseEndPoint + 'risk-analysis/getRiskAnalysisList' + '/' + fsrMasterId;
        return this.http.get(url).pipe(map((res: any) => {
            return res;
        }));
    }

    updateRiskAnalysis(envClimateChangeAnalysis: any, assessmentDisasterResilienceProject: any, file: File, fsrMasterId: any) {
        const formData = new FormData();
        formData.append('envClimateChangeAnalysis', envClimateChangeAnalysis);
        formData.append('assessmentDisasterResilienceProject', assessmentDisasterResilienceProject);
        formData.append('attachmentFile', file);
        formData.append('fsrMasterId', fsrMasterId);

        const url: string = environment.ibcs.ppsFsBaseEndPoint + 'risk-analysis/updateRiskAnalysis';
        return this.http.put(url, formData, {observe: 'response' as 'body'}).pipe(map((res: any) => {
            return res;
        }));
    }
}
