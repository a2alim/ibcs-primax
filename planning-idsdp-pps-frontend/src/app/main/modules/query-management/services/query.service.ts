import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CrudRequestService} from '../../../core/services/crud-request.service';
import {QueryModel} from "../models/query.model";
import {QUERY, QUERY_SEARCH_BY_CRITERIA} from "../constants/query.constant";
import {IResponseBody} from "../../../core/models/response";

@Injectable({
    providedIn: 'root'
})
export class QueryService extends CrudRequestService<QueryModel> {

    constructor(private http: HttpClient) {
        super(http, QUERY);
    }

    searchByCriteria(value: QueryModel, page: number, size: number) {
        const url = QUERY_SEARCH_BY_CRITERIA + '/' + page + '/' + size;
        return this.http.post<IResponseBody<QueryModel>>(url, value);
    }
}
