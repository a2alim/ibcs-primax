import { Injectable } from '@angular/core';
import {CrudRequestService} from '../../../core/services/crud-request.service';
import {MarketAnalysisModel} from '../models/MarketAnalysis.model';
import {HttpClient} from '@angular/common/http';
import {MARKET_ANALYSIS} from '../constants/MarketAnalysisConstant';
import {environment} from '../../../../../environments/environment';
import {map} from 'rxjs/operators';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MarketAnalysisService extends CrudRequestService<MarketAnalysisModel> {

    private subject = new Subject<any>();

  constructor(private http: HttpClient) {
      super(http, MARKET_ANALYSIS);
  }

    feasibilitySummarySaveClickEvent(){
        this.subject.next();
    }

    // for get ProjectSummary Save Event
    getFeasibilitySummarySaveEvent():Observable<any>{
        return this.subject.asObservable();
    }

    // tslint:disable-next-line:max-line-length
    createMarketAnalysis(prbStatement: any, relevanceProjectIdea: any, proposedProjectInterventions: any, stakeholders: any, currentDemand: any, futureDemand: any, variousDemand: any, swotAnalysis: any, file: File, fsrMasterId: any) {
        const formData = new FormData();
        formData.append('prbStatement', prbStatement);
        formData.append('relevanceProjectIdea', relevanceProjectIdea);
        formData.append('proposedProjectInterventions', proposedProjectInterventions);
        formData.append('stakeholders', stakeholders);
        formData.append('currentDemand', currentDemand);
        formData.append('futureDemand', futureDemand);
        formData.append('variousDemand', variousDemand);
        formData.append('swotAnalysis', swotAnalysis);
        formData.append('attachmentFile', file);
        formData.append('fsrMasterId', fsrMasterId);

      //   console.log(marketAnalysis);
        // console.log(data);
        const url: string = environment.ibcs.ppsFsBaseEndPoint + 'market-analysis/createMarketAnalysis';
        return this.http.post(url, formData, {observe: 'response' as 'body'}).pipe(map((res: any) => {
            return res;
        }));
    }

    getMarketAnalysisByPcUuid(fsrMasterId: number): any {
        const url: string = environment.ibcs.ppsFsBaseEndPoint + 'market-analysis/getMarketAnalysisList' + '/' + fsrMasterId;
        return this.http.get(url).pipe(map((res: any) => {
            return res;
        }));
    }

    // tslint:disable-next-line:adjacent-overload-signatures max-line-length
    updateMarketAnalysis(prbStatement: any, relevanceProjectIdea: any, proposedProjectInterventions: any, stakeholders: any, currentDemand: any, futureDemand: any, variousDemand: any, swotAnalysis: any, file: File, fsrMasterId: any) {
        const formData = new FormData();
        formData.append('prbStatement', prbStatement);
        formData.append('relevanceProjectIdea', relevanceProjectIdea);
        formData.append('proposedProjectInterventions', proposedProjectInterventions);
        formData.append('stakeholders', stakeholders);
        formData.append('currentDemand', currentDemand);
        formData.append('futureDemand', futureDemand);
        formData.append('variousDemand', variousDemand);
        formData.append('swotAnalysis', swotAnalysis);
        formData.append('attachmentFile', file);
        formData.append('fsrMasterId', fsrMasterId);

        //   console.log(marketAnalysis);
        // console.log(data);
        const url: string = environment.ibcs.ppsFsBaseEndPoint + 'market-analysis/updateMarketAnalysis';
        return this.http.put(url, formData, {observe: 'response' as 'body'}).pipe(map((res: any) => {
            return res;
        }));
    }
}
