import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CrudRequestService } from '../../../core/services/crud-request.service';
import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs';
import { TppAnnexureFiveModel } from '../models/tppAnnexureFive.model';

@Injectable({
    providedIn: 'root',
})
export class TppAnnexureFiveService extends CrudRequestService<TppAnnexureFiveModel> {

    constructor(private http: HttpClient, ) {
      super(http, environment.ibcs.ppsDppBackendPoint + 'tapp-annexure-five/');
  }

    getData(route): Observable<any> {
        const url = this._BASE_URL + route;
        return this.http.get(url);
    }
}
