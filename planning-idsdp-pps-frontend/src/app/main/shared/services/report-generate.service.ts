import {HttpBackend, HttpClient, HttpHeaders, HttpRequest} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { ApplicationSubmission } from '../model/application-submission.model';

@Injectable({
  providedIn: 'root'
})
export class ReportGenerateService {

  constructor(private http: HttpClient,
              private  handler: HttpBackend) { }

  saveReportEndpont = 'report';
  generateUrl = environment.ibcs.ppsReportEndPoint + this.saveReportEndpont+ '/generate-and-save';
  getReportListUrl = environment.ibcs.ppsReportEndPoint + this.saveReportEndpont+ '/generated-report-list';
  generateAnnexureListUrl = environment.ibcs.ppsReportEndPoint + this.saveReportEndpont+ '/annexxure-generate-and-save';
  generateEcnecDppTappListUrl = environment.ibcs.ppsReportEndPoint + this.saveReportEndpont+ '/dpp-ecnec-save';
    private apiKey = 'fcb5f43a02d5ddad25d6d3d12ea67970';
  generateReport(reportRequest):Observable<any>{
    return this.http.post(this.generateUrl, reportRequest);
  }

  getReportList(pcUuid,sourceId):Observable<any>{
    return this.http.get(this.getReportListUrl+"/"+pcUuid+"/"+sourceId);
  }

  getAnnexxureReport(applicationSubmission:ApplicationSubmission):Observable<any>{
    return this.http.post(this.generateAnnexureListUrl,applicationSubmission);
  }

  saveEcnecDppTappList(obj):Observable<any>{
    return this.http.post(this.generateEcnecDppTappListUrl,obj);
  }
  sendFormDataForComparePdf(formData): any {
      const newHttp = new HttpClient(this.handler);
      const headers = new HttpHeaders({
          Authorization: `Token ${this.apiKey}`
      });
      return newHttp.post('https://api.draftable.com/v1/comparisons', formData, {headers});
  }
}
