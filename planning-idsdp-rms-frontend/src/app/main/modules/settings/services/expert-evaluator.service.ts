import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExpertEvaluatorService {

  constructor(private _httpClient: HttpClient) { }

  baseRmsConfigurationApiEndPoint = environment.ibcs.rmsConfigurationBackend;

  saveExpertEvaluator(expertEvaluator): Observable<any> {
    return this._httpClient.post(this.baseRmsConfigurationApiEndPoint + 'api/expert-evaluator/create', expertEvaluator);
  }

  getList(page, pageSize): Observable<any> {
    return this._httpClient.get(this.baseRmsConfigurationApiEndPoint + 'api/expert-evaluator/get-list/');
  }

  getById(id): Observable<any> {
    return this._httpClient.get(this.baseRmsConfigurationApiEndPoint + 'api/expert-evaluator/get-list/' + id);
  }

  updateExpertEvaluator(expertEvaluator, id): Observable<any> {
    return this._httpClient.put(this.baseRmsConfigurationApiEndPoint + 'api/expert-evaluator/update/' + id, expertEvaluator);
  }

  deleteDataById(id): Observable<any> {
    const url = this.baseRmsConfigurationApiEndPoint + 'api/expert-evaluator/' + id;
    return this._httpClient.delete(url);
  }

  getAll(): Observable<any> {
    return this._httpClient.get(this.baseRmsConfigurationApiEndPoint + 'api/expert-evaluator/get-list');
  }

  findByUserId(userId :  number): Observable<any> {
    return this._httpClient.get(this.baseRmsConfigurationApiEndPoint + 'api/expert-evaluator/find-by-user-id/'+userId);
  }
}
