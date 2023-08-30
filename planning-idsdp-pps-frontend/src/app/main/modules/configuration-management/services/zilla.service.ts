import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CrudRequestService} from '../../../core/services/crud-request.service';
import {ZillaModel} from '../models/zilla.model';
import {environment} from '../../../../../environments/environment';
import {Observable} from "rxjs";
import {SectorModel} from "../models/sector.model";
import {GET_BY_SECTOR_DIVISION_ID} from "../constants/sector.constant";
import {IPriorityModel} from "../models/priority.model";

@Injectable({
  providedIn: 'root'
})
export class ZillaService extends CrudRequestService<ZillaModel>{

    constructor(private http: HttpClient) {
        super(http, environment.ibcs.configurationApiEndPoint + 'zilla/');
    }

    getZillaByDivisionId(divisionId): Observable<ZillaModel[]> {
        return this.http.get<ZillaModel[]>(this._BASE_URL + 'get-by-division-id/'+ divisionId);
    }
}
