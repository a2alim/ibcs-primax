import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CrudRequestService} from '../../../core/services/crud-request.service';
import {UpazillaModel} from '../models/upazilla.model';
import {environment} from '../../../../../environments/environment';
import {Observable} from "rxjs";
import {ZillaModel} from "../models/zilla.model";

@Injectable({
  providedIn: 'root'
})
export class UpazillaService extends CrudRequestService<UpazillaModel>{

    constructor(private http: HttpClient) {
        super(http, environment.ibcs.configurationApiEndPoint + 'upazilla/');
    }

    getUpazillaByZillaId(zillaId): Observable<UpazillaModel[]> {
        return this.http.get<UpazillaModel[]>(this._BASE_URL + 'get-by-zilla-id/'+ zillaId);
    }
}
