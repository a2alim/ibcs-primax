import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs';
import { ApiService } from "../../../core/services/api/api.service";

@Injectable({
  providedIn: 'root'
})
export class FiscalYearServiceService {

  baseRmsConfigurationApiEndPoint = environment.ibcs.rmsConfigurationBackend;

  constructor(private http: HttpClient, private apiService: ApiService,) {
  }


  updateData(data): Observable<any> {
    const url = this.baseRmsConfigurationApiEndPoint + 'api/fiscal-year/update-fiscal-year-unique';
    return this.apiService.update(url, data);
  }

  saveData(data): Observable<any> {
      const url = this.baseRmsConfigurationApiEndPoint + 'api/fiscal-year/create-fiscal-year-unique';
      return this.apiService.post(url, data);
  }

  getListData(page, pageSize): Observable<any> {
      const api = this.baseRmsConfigurationApiEndPoint + 'api/fiscal-year/get-list/' + page + '/' + pageSize;
      return this.apiService.get(api);
  }

  delete(rowUuid) {
      const api = this.baseRmsConfigurationApiEndPoint + 'api/fiscal-year/delete/';
      return this.apiService.delete(api, rowUuid);
  }

  safedelete(rowUuid) {
    const api = this.baseRmsConfigurationApiEndPoint + 'api/fiscal-year/safe-delete/fiscal_year/st_fiscal_year_id/';
    return this.apiService.delete(api, rowUuid);
  }

  getAll() {
      const api = this.baseRmsConfigurationApiEndPoint + 'api/fiscal-year/get-list';
      return this.apiService.get(api);
  }

  getAllActive() {
    const api = this.baseRmsConfigurationApiEndPoint + 'api/fiscal-year/get-active-list';
    return this.apiService.get(api);
  }

  }
