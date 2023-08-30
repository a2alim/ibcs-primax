import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs';
import { ApiService } from "../../../core/services/api/api.service";


@Injectable({
  providedIn: 'root'
})
export class CatWiseActionPlanService {
    baseRmsRpmApiEndPoint = environment.ibcs.rpmBackend+"api/cat-wise-action-plan/";

    constructor(private http: HttpClient, private apiService: ApiService,) {}

    updateData(data): Observable<any> {
        const url = this.baseRmsRpmApiEndPoint + 'create-or-update';
        return this.apiService.update(url, data);
    }

    saveData(data): Observable<any> {
        const url = this.baseRmsRpmApiEndPoint + 'create-or-update';
        return this.apiService.post(url, data);
    }

    getListData(page, pageSize): Observable<any> {
        const api = this.baseRmsRpmApiEndPoint + 'get-list/' + page + '/' + pageSize;
        return this.apiService.get(api);
    }

    delete(rowUuid) {
        const api = this.baseRmsRpmApiEndPoint + 'delete/';
        return this.apiService.delete(api, rowUuid);
    }

    getAll() {
        const api = this.baseRmsRpmApiEndPoint + 'get-list';
        return this.apiService.get(api);
    }

    getAllActive() {
      const api = this.baseRmsRpmApiEndPoint + 'get-active-list';
      return this.apiService.get(api);
    }

  }