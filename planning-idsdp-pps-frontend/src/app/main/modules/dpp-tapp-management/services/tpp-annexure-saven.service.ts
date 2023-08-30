import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CrudRequestService } from '../../../core/services/crud-request.service';
import { environment } from '../../../../../environments/environment';
import { TappProjectDetailsModel } from '../models/tappProjectDetails.model';
import { Observable } from 'rxjs';
import {map} from "rxjs/operators";

@Injectable({
    providedIn: 'root',
})
export class TppAnnexureSavenService extends CrudRequestService<TappProjectDetailsModel> {

    constructor(private http: HttpClient, ) {
      super(http, environment.ibcs.ppsDppBackendPoint + 'tapp-annexure-seven/');
  }

    getData(route): Observable<any> {
        const url = this._BASE_URL + route;
        return this.http.get(url);
    }
    getDetail(route): Observable<any> {
        const url = this._BASE_URL +'get-data/'+ route;
        return this.http.get(url);
    }

    saveData(model: any){
        const url: string = environment.ibcs.ppsDppBackendPoint + 'tapp-annexure-seven/create';
      return this.http.post(url, model).pipe(map((res: any) => {
            return res;
        }));
    }
}
