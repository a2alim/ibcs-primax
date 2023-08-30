import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdpFundReqService {

  private END_POINT = `${environment.ibcs.ppsProjectManagementBackendPoint}adp-fund-request`;
  private CREATE = `${this.END_POINT}/create`;
  private UPDATE = `${this.END_POINT}/update`;
  private GET_ADP_FUND_REQ_LIST = `${this.END_POINT}/get-adp-fund-req-list`;
  private DELETE_BY_ID = `${this.END_POINT}/delete-by-id`;

  constructor(private http: HttpClient) {
  }

  createUpdateAdpFundReq(data: any): Observable<any> {
    if (data.id) {
      return this.http.put(this.UPDATE, data).pipe(map((res: any) => res));
    } else {
      return this.http.post(this.CREATE, data).pipe(map((res: any) => res));
    }
  }

  getAdpFundReqByDppTappUuid(dppTappMasterUuid): Observable<any> {
    const param = new HttpParams().append('dppTappMasterUuid', dppTappMasterUuid);
    return this.http.get(this.GET_ADP_FUND_REQ_LIST, { params: param }).pipe(map((res: any) => res));
  }

  deletePdSelectionByUuid(uuid) {
    const url: string = environment.ibcs.ppsProjectManagementBackendPoint + 'adp-fund-request/delete/' + uuid;
    return this.http.delete(url).pipe(map((res: any) => res));
  }

}
