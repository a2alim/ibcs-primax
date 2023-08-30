import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CrudRequestService} from '../../../core/services/crud-request.service';
import {DivisionModel} from '../models/division.model';
import {environment} from '../../../../../environments/environment';
import {Observable} from 'rxjs';
import {IDetailsCofog} from '../models/details-cofog';

@Injectable({
  providedIn: 'root'
})
export class DivisionService extends CrudRequestService<DivisionModel>{

    constructor(private http: HttpClient) {
        super(http, environment.ibcs.configurationApiEndPoint + 'division/');
    }

    getAllActiveDivisionWithZillaUpazillaAndMunicipalty(): Observable<DivisionModel[]> {
        return this.http.get<DivisionModel[]>(this._BASE_URL + 'getDivisionWithZillaUpazillaMunicipalty');
    }

}
