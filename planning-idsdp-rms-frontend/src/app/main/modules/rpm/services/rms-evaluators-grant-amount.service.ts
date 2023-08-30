import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {CrudRequestService} from 'app/main/core/services/crud-request.service';
import {environment} from 'environments/environment';
import {
    GET_BY_RMS_EVALUATORS_GRANT_AMOUNT_LETTER_ID,
    RMS_EVALUATORS_GRANT_AMOUNT,
    SAVE_LIST
} from "../contants/evaluators-grant-amount.constant";
import {Observable} from "rxjs";
import {CoreResponse} from "../../../core/models/response";
import {EvaluatorsGrantAmount} from "../models/EvaluatorsGrantAmount";

@Injectable({
    providedIn: 'root'
})
export class RmsEvaluatorsGrantAmountService extends CrudRequestService {

    baseRmsConfigurationApiEndPoint = environment.ibcs.rpmBackend;

    constructor(private http: HttpClient) {
        super(http, RMS_EVALUATORS_GRANT_AMOUNT);
    }

    getByRmsEvaluatorsGrantAmountLetterId(id: number): Observable<CoreResponse<EvaluatorsGrantAmount>> {
        return this.http.get<CoreResponse<EvaluatorsGrantAmount>>(this._BASE_URL + GET_BY_RMS_EVALUATORS_GRANT_AMOUNT_LETTER_ID + "/" + id);
    }

    saveList(data: EvaluatorsGrantAmount[]): Observable<CoreResponse<EvaluatorsGrantAmount>> {
        return this.http.post<CoreResponse<EvaluatorsGrantAmount>>(this._BASE_URL + SAVE_LIST, data);
    }

}
