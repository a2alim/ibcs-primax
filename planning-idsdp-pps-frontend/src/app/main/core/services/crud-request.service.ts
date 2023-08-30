import {IResponseBody, IResponseData} from '../models/response';
import {IRequestBody} from '../models/request';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {
    CREATE_URL,
    SAVE_URL,
    DELETE_URL, GET_BY_ID_URL,
    GET_BY_UUID_URL, GET_LIST_BY_ID_SET_URL,
    GET_LIST_BY_UUID_SET_URL,
    GET_LIST_URL,
    UPDATE_URL
} from '../constants/api';

export abstract class CrudRequestService<I extends IRequestBody & IResponseData> {

    protected constructor(private httpClient: HttpClient,
                          protected _BASE_URL: string) {
    }

    // For getting all list
    getList(): Observable<I[]> {
        return this.httpClient.get<I[]>( this._BASE_URL + GET_LIST_URL);
    }

    // For getting all list with pagination
    getListWithPagination(page: number, size: number): Observable<IResponseBody<I>> {
        return this.httpClient.get<IResponseBody<I>>( this._BASE_URL + GET_LIST_URL + '/' + page + '/' + size);
    }

    // For getting by UUID
    getByUuid(uuid: string): Observable<I> {
        return this.httpClient.get<I>( this._BASE_URL + GET_BY_UUID_URL + '/' + uuid);
    }

    // For getting by ID
    getById(id: number): Observable<I> {
        return this.httpClient.get<I>( this._BASE_URL + GET_BY_ID_URL + '/' + id);
    }

    getData(route): Observable<any> {
        const url = this._BASE_URL + route;
        return this.httpClient.get(url);
    }

    // For creating data
    create(i: I): Observable<I> {
        return this.httpClient.post<I>( this._BASE_URL + CREATE_URL, i);
    }

    save(i: I): Observable<I> {
        return this.httpClient.post<I>( this._BASE_URL + SAVE_URL, i);
    }

    // For updating data
    update(i: I): Observable<I> {
        return this.httpClient.put<I>( this._BASE_URL + UPDATE_URL, i);
    }

    // For deleting data
    delete(uuid: string): Observable<{ value: boolean }> {
        return this.httpClient.delete<{ value: boolean }>( this._BASE_URL + DELETE_URL + '/' + uuid);
    }

    // For getting by UUID set
    getByUuidSet(uuids: string[]): Observable<I[]> {
        return this.httpClient.post<I[]>( this._BASE_URL + GET_LIST_BY_UUID_SET_URL, {uuids: uuids});
    }

    // For getting by ID set
    getByIdSet(ids: string[]): Observable<I[]> {
        return this.httpClient.post<I[]>( this._BASE_URL + GET_LIST_BY_ID_SET_URL, {ids: ids});
    }

}
