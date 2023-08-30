import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CrudRequestService} from '../../../core/services/crud-request.service';
import {SectorModel} from '../models/sector.model';
import {GET_ACTIVE_SECTOR, GET_BY_SECTOR_DIVISION_ID, SECTOR} from '../constants/sector.constant';
import {Observable} from 'rxjs';
import {IOptionalCofog} from '../models/optional-cofog';
import {GET_BY_MAIN_COFOG_ID} from '../constants/optional-cofog.constant';

@Injectable({
  providedIn: 'root'
})
export class SectorService extends CrudRequestService<SectorModel> {

    constructor(private http: HttpClient) {
        super(http, SECTOR);
    }

    //For get active status sector api call
    getActiveSector(): Observable<SectorModel[]> {
        return this.http.get<SectorModel[]>(GET_ACTIVE_SECTOR);
    }

    // For getting all active Sector List list by Sector Division ID
    getBySectorDivisionId(sectorDivisionId: number): Observable<SectorModel[]> {
        return this.http.get<SectorModel[]>(this._BASE_URL + GET_BY_SECTOR_DIVISION_ID + '/' + sectorDivisionId);
    }
}
