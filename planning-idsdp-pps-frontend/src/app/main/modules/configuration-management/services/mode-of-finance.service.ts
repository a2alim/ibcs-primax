import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CrudRequestService} from '../../../core/services/crud-request.service';
import {Observable} from 'rxjs';
import {IModeOfFinance} from '../models/mode-of-finance';
import {
    GET_ACTIVE_MODE_OF_FINANCE, GET_ACTIVE_MODE_OF_FINANCE_BY_ORDER_ID,
    MODE_OF_FINANCE,
    MOVE_MODE_FINANCE
} from '../constants/mode-of-finance.constant';
import {IResponseBody} from '../../../core/models/response';
import {ProjectMovementModel} from "../models/project-movement.model";
import {GET_PROJECT_MOVEMENT_BY_ORDER_ID} from "../constants/project-movement.constant";

@Injectable({
    providedIn: 'root'
})
export class ModeOfFinanceConfigService extends CrudRequestService<IModeOfFinance> {

    baseUrl = '';

    constructor(private http: HttpClient) {
        super(http, MODE_OF_FINANCE);
    }


    // For getting all active Mode of Finance list
    getActiveModeOfFinance(page?: number, size?: number): Observable<IResponseBody<IModeOfFinance>> {
        return this.http.get<IResponseBody<IModeOfFinance>>(this._BASE_URL + GET_ACTIVE_MODE_OF_FINANCE + '/' + page + '/' + size);
    }

    // For getting all active Mode of Finance list with pagination and order
    getActiveModeOfFinanceByOrderId(page: number, size: number): Observable<IResponseBody<IModeOfFinance>> {
        return this.http.get<IResponseBody<IModeOfFinance>>(this._BASE_URL + GET_ACTIVE_MODE_OF_FINANCE_BY_ORDER_ID + '/' + page + '/' + size);
    }

    // Call for hierarchy change
    moveModeFinance(modeFinanceIds) {
        const modeFianceMove = {
            modeFinanceIds: modeFinanceIds
        };
        return this.http.post(this._BASE_URL + MOVE_MODE_FINANCE, modeFianceMove);
    }



    getActiveModOfFin(route): Observable<any> {
        const url = this._BASE_URL + route;
        return this.http.get(url);
    }

}
