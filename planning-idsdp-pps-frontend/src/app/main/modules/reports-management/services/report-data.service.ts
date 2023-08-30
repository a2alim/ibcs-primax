import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CrudRequestService } from 'app/main/core/services/crud-request.service';
import { environment } from 'environments/environment';
import { map } from 'rxjs/internal/operators/map';

import { ApprovalValueSetupModel } from '../../configuration-management/models/approval-value-setup-model';

@Injectable({
  providedIn: 'root'
})
export class ReportDataService extends CrudRequestService<ApprovalValueSetupModel>{

  public REPORT_DATA_URL = `${environment.ibcs.ppsReportEndPoint}report/data-one/41`;
  public PFS_REPORT_DATA_URL = `${environment.ibcs.ppsReportEndPoint}report/pfs-report-data/`;
  public FEASIBILITY_STUDY_REPORT_DATA_URL = `${environment.ibcs.ppsReportEndPoint}report/feasibility-study-report-data/1`;

  constructor(private http: HttpClient) {
    super(http, environment.ibcs.ppsReportEndPoint + 'report/');
  }

  getReportData(): any {
    return this.http.get<any>(this.REPORT_DATA_URL).pipe(map((data: any) => data));
  }

  getPfsReportData(projectConceptUuid: string): any {
    return this.http.get<any>(`${this.PFS_REPORT_DATA_URL}${projectConceptUuid}`).pipe(map((data: any) => data));
  }

  getFeasibilityStudyReportData(): any {
    return this.http.get<any>(this.FEASIBILITY_STUDY_REPORT_DATA_URL).pipe(map((data: any) => data));
  }

}
