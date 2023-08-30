import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs';
import { ApiService } from "../../../core/services/api/api.service";

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

    rootUrl = environment.ibcs.rmsConfigurationBackend;
    rpmBackend = environment.ibcs.rpmBackend;

    constructor(private http: HttpClient, private apiService: ApiService,) {
    }

    getFiscalYearList(): Observable<any> {
      const api = this.rootUrl+'api/fiscal-year/get-list/';
      return this.apiService.get(api);
    }

    getProfessionList(): Observable<any> {
      const api = 'api/profession/get-list/';
      return this.apiService.get(api);
    }

    getAllFiscalYearByFinalCopy(): Observable<any> {
        const api = this.rpmBackend+'api/fyw-sector-sub-sector/final-copy/fiscal-year/all';
        return this.apiService.get(api);
    }

    getActiveFiscalYear() {
        return this.http.get<any>(this.rpmBackend + 'api/fyw-sector-sub-sector/get/available/fiscal-year');
    }
}
