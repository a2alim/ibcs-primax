import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CrudRequestService} from '../../../core/services/crud-request.service';
import {SubSectorModel} from '../models/sub-sector.model';
import {GET_BY_SECTOR_ID, SUB_SECTOR} from '../constants/sub-sector.constant';
import {Observable} from 'rxjs';
import {IOptionalCofog} from '../models/optional-cofog';
import {GET_BY_MAIN_COFOG_ID} from '../constants/optional-cofog.constant';

@Injectable({
  providedIn: 'root'
})
export class SubSectorService extends CrudRequestService<SubSectorModel> {

    constructor(private http: HttpClient) {
        super(http, SUB_SECTOR);
    }

    //For get sub sector by sector id api call
    getBySectorId(sectorId: number): Observable<SubSectorModel[]> {
        return this.http.get<SubSectorModel[]>(this._BASE_URL + GET_BY_SECTOR_ID + '/' + sectorId);
    }


}
