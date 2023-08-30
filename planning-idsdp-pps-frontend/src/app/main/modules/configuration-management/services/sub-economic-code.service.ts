import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CrudRequestService} from '../../../core/services/crud-request.service';
import {SubEconomicCodeModel} from '../models/sub-economic-code-model';
import {environment} from '../../../../../environments/environment';
import {Observable} from 'rxjs';
import {
    GET_ACTIVE_SUB_ECONOMIC_LIST,
    GET_BY_ECONOMIC_CODE_ID, GET_BY_ECONOMIC_CODES,
    SUB_ECONOMIC_CODE
} from '../constants/sub-economic-code.constant';

@Injectable({
    providedIn: 'root'
})
export class SubEconomicCodeService extends CrudRequestService<SubEconomicCodeModel> {

    constructor(private http: HttpClient) {
        super(http, SUB_ECONOMIC_CODE);
    }

    getActiveSubEconomicCodeList(): Observable<SubEconomicCodeModel[]> {
        return this.http.get<SubEconomicCodeModel[]>( this._BASE_URL + GET_ACTIVE_SUB_ECONOMIC_LIST);
    }

    getByEconomicCodeId(economicCodeId: number): Observable<SubEconomicCodeModel[]> {
        return this.http.get<SubEconomicCodeModel[]>(this._BASE_URL + GET_BY_ECONOMIC_CODE_ID + '/' + economicCodeId);
    }

    getByEconomicCodes(economicCodes: number[]): Observable<{economicCodeId: number, subEconomicCodes: SubEconomicCodeModel[]}[]> {
        return this.http.post<{economicCodeId: number, subEconomicCodes: SubEconomicCodeModel[]}[]>(this._BASE_URL + GET_BY_ECONOMIC_CODES, {ids: economicCodes});
    }
}
