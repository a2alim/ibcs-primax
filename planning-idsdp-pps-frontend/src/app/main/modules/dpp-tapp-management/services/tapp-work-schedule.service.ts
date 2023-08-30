import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TappWorkScheduleService {

  private END_POINT = `${environment.ibcs.ppsDppBackendPoint}work-plan`;
  private SAVE_WORK_PLAN = `${this.END_POINT}/save-work-plan`;
  private GET_WORK_PLAN_LIST = `${this.END_POINT}/get-work-plan-list`;
  private DELETE_BY_ID = `${this.END_POINT}/delete-by-id`;

  constructor(private http: HttpClient) {
  }

  createWorkPlan(data: any): Observable<any> {
    return this.http.post(this.SAVE_WORK_PLAN, data).pipe(map((res: any) => res));
  }

  getWorkinngScheduleList(tappMasterId): Observable<any> {
    return this.http.get(this.GET_WORK_PLAN_LIST + '/' + tappMasterId).pipe(map((res: any) => res));
  }

  deleteById(id) {
    return this.http.delete(this.DELETE_BY_ID + '/' + id).pipe(map((res: any) => res));
  }

}
