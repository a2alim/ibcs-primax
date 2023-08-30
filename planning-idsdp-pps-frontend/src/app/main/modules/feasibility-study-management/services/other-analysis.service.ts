import { Injectable } from '@angular/core';
import {CrudRequestService} from '../../../core/services/crud-request.service';
import {OtherAnalysisModel} from '../models/other-analysis.model';
import {HttpClient} from '@angular/common/http';
import {OTHER_ANALYSIS} from '../constants/other-analysis.constant';
import {environment} from '../../../../../environments/environment';
import {map} from 'rxjs/operators';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OtherAnalysisService extends CrudRequestService<OtherAnalysisModel> {
    private subject = new Subject<any>();

  constructor(private http: HttpClient) {
      super(http, OTHER_ANALYSIS);
  }

    feasibilitySummarySaveClickEvent(){
        this.subject.next();
    }

    // for get ProjectSummary Save Event
    getFeasibilitySummarySaveEvent():Observable<any>{
        return this.subject.asObservable();
    }

    // tslint:disable-next-line:max-line-length
    createOtherAnalysis(humanResourceAnalysis: any, institutionalAnalysis: any, riskSensitivityAnalysis: any, alternativesAnalysis: any, recommendationConclution: any, file: File, fsrMasterId: any) {
        const formData = new FormData();
        formData.append('humanResourceAnalysis', humanResourceAnalysis);
        formData.append('institutionalAnalysis', institutionalAnalysis);
        formData.append('riskSensitivityAnalysis', riskSensitivityAnalysis);
        formData.append('alternativesAnalysis', alternativesAnalysis);
        formData.append('recommendationConclution', recommendationConclution);
        formData.append('attachmentFile', file);
        formData.append('fsrMasterId', fsrMasterId);

        const url: string = environment.ibcs.ppsFsBaseEndPoint + 'other-analysis/createOtherAnalysis';
        return this.http.post(url, formData, {observe: 'response' as 'body'}).pipe(map((res: any) => {
            return res;
        }));
    }

    getOtherAnalysisByPcUuid(fsrMasterId: number): any {
        const url: string = environment.ibcs.ppsFsBaseEndPoint + 'other-analysis/getOtherAnalysisList' + '/' + fsrMasterId;
        return this.http.get(url).pipe(map((res: any) => {
            return res;
        }));
    }

    // tslint:disable-next-line:max-line-length
    updateOtherAnalysis(humanResourceAnalysis: any, institutionalAnalysis: any, riskSensitivityAnalysis: any, alternativesAnalysis: any, recommendationConclution: any, file: File, fsrMasterId: any) {
        const formData = new FormData();
        formData.append('humanResourceAnalysis', humanResourceAnalysis);
        formData.append('institutionalAnalysis', institutionalAnalysis);
        formData.append('riskSensitivityAnalysis', riskSensitivityAnalysis);
        formData.append('alternativesAnalysis', alternativesAnalysis);
        formData.append('recommendationConclution', recommendationConclution);
        formData.append('attachmentFile', file);
        formData.append('fsrMasterId', fsrMasterId);

        const url: string = environment.ibcs.ppsFsBaseEndPoint + 'other-analysis/updateOtherAnalysis';
        return this.http.put(url, formData, {observe: 'response' as 'body'}).pipe(map((res: any) => {
            return res;
        }));
    }
}
