import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from 'app/main/core/services/api/api.service';
import { environment } from 'environments/environment';
import { cloneDeep } from 'lodash';
import { Observable } from 'rxjs';
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ReceiveBankChequeService {

  element: any;
  baseRmsRpmApiEndPoint = environment.ibcs.rpmBackend;
  baseRmsConfigurationApiEndPoint = environment.ibcs.rmsConfigurationBackend;
  minioEndPointHost = environment.ibcs.minioEndPointHost;
  private workingBankCheque;
  constructor(private apiService: ApiService,private http: HttpClient) {

  }

  public getWorkingBankCheque() {
    return this.workingBankCheque;
  }

  public delete(id): Observable<any> {
    return this.apiService.delete(this.baseRmsRpmApiEndPoint + 'api/received-bank-cheque/deletebyid/', +id);
  }

  public setWorkingBankCheque(wbs) {
    this.workingBankCheque = cloneDeep(wbs);
  }

  public getBankChequeById(id: string): Observable<any>{
        const url = this.baseRmsRpmApiEndPoint + 'api/received-bank-cheque-upload-doc/getbyreceivedbankchequeid/' + id;
        return this.apiService.get(url).pipe(map((data: any) => data));
    }

  public saveBankCheque(data: any): Observable<any> {
    return this.apiService.post(this.baseRmsRpmApiEndPoint + 'api/received-bank-cheque/save', data);
  }


  public getChequeList(pageQuery: any): Observable<any> {
    return this.apiService.post(this.baseRmsRpmApiEndPoint + 'api/received-bank-cheque/getall', pageQuery);
  }

  public getUploadedFiles(id: string): Observable<any> {
    return this.apiService.get(this.baseRmsRpmApiEndPoint + `api/received-bank-cheque-upload-doc/getbyreceivedbankchequeid/${id}`);
  }

  public saveFile(dataList, files: File[], updatedFileList: any[]): Observable<any> {
      const frmData = new FormData();

      frmData.append('body', JSON.stringify(dataList));

      if (updatedFileList != null) {

          for (var i = 0; i < updatedFileList.length; i++) {
              if (!updatedFileList[i]) {
                  updatedFileList[i] = 0;
              }
          }
      }
      updatedFileList = updatedFileList.filter(f => f != 0);
      frmData.append('updatedFileList', JSON.stringify(updatedFileList));

      if (files != null) {
          for (var i = 0; i < files.length; i++) {
              frmData.append('file', files[i]);
          }
      }

      const url = this.baseRmsRpmApiEndPoint + 'api/received-bank-cheque-upload-doc/save';
      return this.apiService.post(url, frmData).pipe(map((data: any) => data));
  }

    /*downloadFile(filename : string): Observable<Blob> {
        return this.http.get(this.minioEndPointHost + 'attachment/view/' + filename, {responseType: 'blob'});
    }*/

    downloadFile(filename) {
        const api = this.minioEndPointHost + filename;
        return this.apiService.get(api);
    }
}
