import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CrudRequestService} from '../../../core/services/crud-request.service';
import {SectorDivisionModel} from '../models/sector-division.model';
import {GET_ACTIVE_SECTOR_DIVISION, SECTOR_DIVISION} from '../constants/sector-division.constant';
import {Observable} from 'rxjs';
import {IResponseBody} from '../../../core/models/response';
import {IOptionalCofog} from '../models/optional-cofog';

@Injectable({
  providedIn: 'root'
})
export class SectorDivisionService extends CrudRequestService<SectorDivisionModel> {

  constructor(private http: HttpClient) {
    super(http, SECTOR_DIVISION);
   }

   //For get active sector division api call
    getActiveSectorDivision(): Observable<SectorDivisionModel[]> {
        return this.http.get<SectorDivisionModel[]>(GET_ACTIVE_SECTOR_DIVISION);
    }
}
