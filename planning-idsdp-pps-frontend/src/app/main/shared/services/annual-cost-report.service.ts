import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CrudRequestService } from 'app/main/core/services/crud-request.service';
import { ApprovalValueSetupModel } from 'app/main/modules/configuration-management/models/approval-value-setup-model';
import { environment } from 'environments/environment';
import { map } from 'rxjs/internal/operators/map';



@Injectable({
  providedIn: 'root'
})
export class AnnualCostReportService extends CrudRequestService<ApprovalValueSetupModel>{

  public REPORT_DATA_URL = `${environment.ibcs.ppsReportEndPoint}report/data-one/`;
  public PC_REPORT_DATA_URL = `${environment.ibcs.ppsReportEndPoint}report/ppsbyuuid/`;
  public PFS_REPORT_DATA_URL = `${environment.ibcs.ppsReportEndPoint}report/`;
  public FEASIBILITY_STUDY_REPORT_DATA_URL = `${environment.ibcs.ppsReportEndPoint}report/feasibility-study-report-data/1`;
  public ANNEXURE_FIVE_A_DATA_URL = `${environment.ibcs.ppsReportEndPoint}annexure-five-a/find-by-uuid/`;
  public ANNEXURE_TWO_DATA_URL = `${environment.ibcs.ppsReportEndPoint}project-management-report/find-by-uuid/`;
  public ANNUAL_COST_URL = `${environment.ibcs.ppsReportEndPoint}report/dpp-tapp/amortization-schedule/`;

  constructor(private http: HttpClient) {
    super(http, environment.ibcs.ppsReportEndPoint + 'report/');
  }

  getReportData(projectConceptUuid: string): any {
    return this.http.get<any>(`${this.REPORT_DATA_URL}${projectConceptUuid}`).pipe(map((data: any) => data));
  }

  getPcRportData(projectConceptUuid: string): any {
    return this.http.get<any>(`${this.PC_REPORT_DATA_URL}${projectConceptUuid}`).pipe(map((data: any) => data));
  }

  getPfsReportData(projectConceptUuid: string): any {
    return this.http.get<any>(`${this.PFS_REPORT_DATA_URL}${projectConceptUuid}`).pipe(map((data: any) => data));
  }

  getFeasibilityStudyReportData(): any {
    return this.http.get<any>(this.FEASIBILITY_STUDY_REPORT_DATA_URL).pipe(map((data: any) => data));
  }


  getAnnexureFiveAReport(uuId){
    const httpOptions = { 'responseType': 'arraybuffer' as 'json' };
    return this.http.get<any>(this.ANNEXURE_FIVE_A_DATA_URL+uuId, httpOptions);
  }

  getAnnualCostReport(uuId){
    const httpOptions = { 'responseType': 'arraybuffer' as 'json' };
    return this.http.get<any>(this.ANNUAL_COST_URL+uuId, httpOptions);
  }

}
