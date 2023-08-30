import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ExpenditureModel } from '../models/expenditure.model';
import { PmPdSelectionModel } from '../models/pm-pd-selection.model';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class ExpenditureService {

  private baseUrl;

  constructor(private http: HttpClient) {
    this.baseUrl = environment.ibcs.ppsProjectManagementBackendPoint;
  }

  createExpenditure(data: ExpenditureModel): Observable<any> {
    const formData = new FormData();
    formData.append('data', JSON.stringify(data));
    formData.append('file', data.attachedFile);
    const url: string = this.baseUrl + 'expenditure/create-expenditure';
    return this.http.post(url, formData).pipe(map((res: any) => res));
  }

  getExpenditureByDppTappMasterUuid(dppTappMasterUuid: string): Observable<any> {
    const param = new HttpParams().append('dppTappMasterUuid', dppTappMasterUuid);
    const url: string = this.baseUrl + 'expenditure/get-expenditure-list';
    return this.http.get(url, { params: param }).pipe(map((res: any) => res));
  }

  deleteExpenditureByUuid(uuid) {
    const param = new HttpParams().append('uuid', uuid);
    const url: string = this.baseUrl + 'expenditure/delete-by-uuid';
    return this.http.delete(url, { params: param }).pipe(map((res: any) => res));
  }

  getAttachmentByUuid(id: number) {
    return this.http.get<any>(environment.ibcs.ppsProjectManagementBackendPoint + 'attachment' + '/get-by-id' + '/' + id);
  }

  download(pdfUrl: string) {
    const httpOptions = {
        'responseType'  : 'blob' as 'json'
    };
    const url = environment.ibcs.ppsProjectManagementBackendPoint + pdfUrl;
    return this.http.get<any>(url, httpOptions).subscribe( res=> {
        saveAs(res);
    });
}

}
