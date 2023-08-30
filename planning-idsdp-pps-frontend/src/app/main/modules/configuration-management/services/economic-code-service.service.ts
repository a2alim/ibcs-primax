import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CrudRequestService} from '../../../core/services/crud-request.service';
import {EconomicTypeModel} from '../models/economic-code-model';
import {environment} from '../../../../../environments/environment';
import {Observable} from 'rxjs';
import {ECONOMIC_CODE, GET_ACTIVE_ECONOMIC_LIST} from '../constants/economic-code.constant';

@Injectable({
    providedIn: 'root'
})
export class EconomicCodeService extends CrudRequestService<EconomicTypeModel> {

    constructor(private http: HttpClient) {
        super(http, ECONOMIC_CODE);
    }

    fetchActiveEconomicCodeList(): Observable<EconomicTypeModel[]> {
        return this.http.get<EconomicTypeModel[]>( this._BASE_URL + GET_ACTIVE_ECONOMIC_LIST);
    }
}
