import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CrudRequestService} from '../../../core/services/crud-request.service';
import {Observable} from 'rxjs';
import {IResponseBody} from '../../../core/models/response';
import {GET_ACTIVE_QUESTION, GET_ACTIVE_QUESTION_LIST, QUESTION_TYPE} from "../constants/question-type.constant";
import {QuestionTypeModel} from "../models/question-type.model";

@Injectable({
    providedIn: 'root'
})
export class QuestionTypeService extends CrudRequestService<QuestionTypeModel> {

    baseUrl = '';

    constructor(private http: HttpClient) {
        super(http, QUESTION_TYPE);
    }

    getActiveQuestion(page?: number, size?: number): Observable<IResponseBody<QuestionTypeModel>> {
        return this.http.get<IResponseBody<QuestionTypeModel>>(GET_ACTIVE_QUESTION + '/' + page + '/' + size);
    }

    getActiveQuestionList(): Observable<QuestionTypeModel[]> {
        return this.http.get<QuestionTypeModel[]>(GET_ACTIVE_QUESTION_LIST);
    }

}
