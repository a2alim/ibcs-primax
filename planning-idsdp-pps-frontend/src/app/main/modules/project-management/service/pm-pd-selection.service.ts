import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PmPdSelectionModel } from '../models/pm-pd-selection.model';

@Injectable({
  providedIn: 'root'
})
export class PmPdSelectionService {

  private baseUrl;

  constructor(private http: HttpClient) {
    this.baseUrl = environment.ibcs.ppsProjectManagementBackendPoint;
  }

  createPdSelection(data: PmPdSelectionModel): Observable<any> {
    const formData = new FormData();
    formData.append('data', JSON.stringify(data));
    formData.append('file', data.attachedFile);
    const url: string = this.baseUrl + 'pd-selection/create-pd-selection';
    return this.http.post(url, formData).pipe(map((res: any) => res));
  }

  getPdListByDppTappMasterUuid(dppTappMasterUuid: string): Observable<any> {
    const param = new HttpParams().append('dppTappMasterUuid', dppTappMasterUuid);
    const url: string = this.baseUrl + 'pd-selection/get-pd-selection-list';
    return this.http.get(url, { params: param }).pipe(map((res: any) => res));
  }

  // deletePdSelectionByUuid(uuid){
  //   const param = new HttpParams().append('uuid', uuid);
  //   const url: string = this.baseUrl + 'pd-selection/delete-by-uuid';
  //   return this.http.delete(url, { params: param }).pipe(map((res: any) => res));
  // }

  deletePdSelectionByUuid(uuid) {
    const url: string = this.baseUrl + 'pd-selection/delete/' + uuid;
    return this.http.delete(url).pipe(map((res: any) => res));
  }

}
