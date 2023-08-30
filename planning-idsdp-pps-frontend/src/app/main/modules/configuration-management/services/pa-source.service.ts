import { Injectable } from '@angular/core';
import {CrudRequestService} from '../../../core/services/crud-request.service';
import {IPaSourceModel} from '../models/pa-source.model';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../../environments/environment';
import {Observable} from "rxjs";
import {SectorModel} from "../models/sector.model";
import {GET_ACTIVE_SECTOR} from "../constants/sector.constant";
import {GET_ACTIVE_PA_SOURCE} from "../constants/pa-source.constant";

@Injectable({
  providedIn: 'root'
})
export class PaSourceService extends CrudRequestService<IPaSourceModel>{

    baseUrl = '';

    constructor(private http: HttpClient) {
      super(http, environment.ibcs.configurationApiEndPoint + 'paSource/');
    }

    //For get active status sector api call
    getActivePaSource(): Observable<IPaSourceModel[]> {
        return this.http.get<IPaSourceModel[]>(GET_ACTIVE_PA_SOURCE);
    }
}
