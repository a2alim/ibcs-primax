import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CrudRequestService} from '../../../core/services/crud-request.service';
import {ANSWER_BANK, ANSWER_BANK_BY_QUERY_ID} from "../constants/answer-bank.constant";
import {AnswerBankModel} from "../models/answer-bank.model";
import {Observable} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class AnswerBankService extends CrudRequestService<AnswerBankModel> {

    constructor(private http: HttpClient) {
        super(http, ANSWER_BANK);
    }

    getAnswerBankByQueryId(id): Observable<AnswerBankModel> {
        return this.http.get<AnswerBankModel>(ANSWER_BANK + ANSWER_BANK_BY_QUERY_ID + "/" + id);
    }
}
