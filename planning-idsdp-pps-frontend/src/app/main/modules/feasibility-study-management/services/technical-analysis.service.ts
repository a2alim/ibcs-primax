import { Injectable } from '@angular/core';
import {CrudRequestService} from '../../../core/services/crud-request.service';
import {TechnicalAnalysisModel} from '../models/technical-analysis.model';
import {HttpClient} from '@angular/common/http';
import {TECHNICAL_ANALYSIS} from '../constants/technical-analysis.constant';
import {environment} from '../../../../../environments/environment';
import {map} from 'rxjs/operators';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TechnicalAnalysisService extends CrudRequestService<TechnicalAnalysisModel> {

    private subject = new Subject<any>();

  constructor(private http: HttpClient) {
      super(http, TECHNICAL_ANALYSIS);
  }

    feasibilitySummarySaveClickEvent(){
        this.subject.next();
    }

    // for get ProjectSummary Save Event
    getFeasibilitySummarySaveEvent():Observable<any>{
        return this.subject.asObservable();
    }

    createTechnicalAnalysis(location: any, technicalDesign: any, outputPlan: any, costEstimates: any, impTimeline: any, file: File, fsrMasterId: any) {
        const formData = new FormData();
        formData.append('location', location);
        formData.append('technicalDesign', technicalDesign);
        formData.append('outputPlan', outputPlan);
        formData.append('costEstimates', costEstimates);
        formData.append('impTimeline', impTimeline);
        formData.append('attachmentFile', file);
        formData.append('fsrMasterId', fsrMasterId);

        const url: string = environment.ibcs.ppsFsBaseEndPoint + 'technical-analysis/createTechnicalAnalysis';
        return this.http.post(url, formData, {observe: 'response' as 'body'}).pipe(map((res: any) => {
            return res;
        }));
    }

    getTechnicalAnalysisByPcUuid(fsrMasterId: number): any {
        const url: string = environment.ibcs.ppsFsBaseEndPoint + 'technical-analysis/getTechnicalAnalysisList' + '/' + fsrMasterId;
        return this.http.get(url).pipe(map((res: any) => {
            return res;
        }));
    }

    updateTechnicalAnalysis(location: any, technicalDesign: any, outputPlan: any, costEstimates: any, impTimeline: any, file: File, fsrMasterId: any) {
        const formData = new FormData();
        formData.append('location', location);
        formData.append('technicalDesign', technicalDesign);
        formData.append('outputPlan', outputPlan);
        formData.append('costEstimates', costEstimates);
        formData.append('impTimeline', impTimeline);
        formData.append('attachmentFile', file);
        formData.append('fsrMasterId', fsrMasterId);

        const url: string = environment.ibcs.ppsFsBaseEndPoint + 'technical-analysis/updateTechnicalAnalysis';
        return this.http.put(url, formData, {observe: 'response' as 'body'}).pipe(map((res: any) => {
            return res;
        }));
    }
}
