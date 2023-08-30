import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProcurementPlanService {

  private END_POINT = `${environment.ibcs.ppsProjectManagementBackendPoint}procurement-plan`;
  private PROCUREMENT_PLAN_SAVE = `${this.END_POINT}/save-procurement-plan`;
  private GET_PROCUTEMENT_PLAN_LIST = `${this.END_POINT}/get-procurement-plan-list`;
  private DELETE_ROW = `${this.END_POINT}/delete-row`;

  constructor(private http: HttpClient) {
  }

  createProcurementPlan(data: any): Observable<any> {
    return this.http.post(this.PROCUREMENT_PLAN_SAVE, data).pipe(map((res: any) => res));
  }

  getGetProcurementPlanByDppTappMasterUuid(formType, dppTappMasterUuid): Observable<any> {
    return this.http.get(this.GET_PROCUTEMENT_PLAN_LIST + '/' + formType + '/' + dppTappMasterUuid).pipe(map((res: any) => res));
  }

  deleteById(id) {
    return this.http.delete(this.DELETE_ROW + '/' + id).pipe(map((res: any) => res));
  }

}
