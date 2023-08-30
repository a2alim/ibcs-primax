import {CoreResponse, IResponseBody, IResponseData} from '../models/response';
import { IRequestBody } from '../models/request';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
    CREATE_URL,
    SAVE_URL,
    DELETE_URL, GET_BY_ID_URL,
    GET_BY_UUID_URL, GET_LIST_BY_ID_SET_URL,
    GET_LIST_BY_UUID_SET_URL,
    GET_LIST_URL,
    UPDATE_URL
} from '../constants/api';

export abstract class CrudRequestService {

    protected constructor(private httpClient: HttpClient,
        protected _BASE_URL: string) {
    }

    // For getting all list
    getList(): Observable<CoreResponse<any>> {
        return this.httpClient.get<CoreResponse<any>>(this._BASE_URL + GET_LIST_URL);
    }

    getAll(): Observable<any> {
        return this.httpClient.get<CoreResponse<any>>(this._BASE_URL + GET_LIST_URL);
    }

    getAllByFinalSubmit(isFinal): Observable<any> {
        return this.httpClient.get<CoreResponse<any>>(this._BASE_URL + GET_LIST_URL+'/'+isFinal);
    }

    // For getting all list with pagination
    getListWithPagination(page: number, size: number): Observable<CoreResponse<any>> {
        return this.httpClient.get<CoreResponse<any>>(this._BASE_URL + GET_LIST_URL + '/' + page + '/' + size);
    }

    // For getting all list with pagination
    getListData(page: number, size: number): Observable<CoreResponse<any>> {
        return this.httpClient.get<CoreResponse<any>>(this._BASE_URL + GET_LIST_URL + '/' + page + '/' + size);
    }

    // For getting by UUID
    getByUuid(uuid: string): Observable<CoreResponse<any>> {
        return this.httpClient.get<CoreResponse<any>>(this._BASE_URL + GET_BY_UUID_URL + '/' + uuid);
    }

    // For getting by ID
    getById(id: number): Observable<CoreResponse<any>> {
        return this.httpClient.get<CoreResponse<any>>(this._BASE_URL + GET_BY_ID_URL + '/' + id);
    }

    getData(route): Observable<any> {
        const url = this._BASE_URL + route;
        return this.httpClient.get(url);
    }

    // For creating data
    create(i: any): Observable<CoreResponse<any>> {
        return this.httpClient.post<CoreResponse<any>>(this._BASE_URL + CREATE_URL, i);
    }

    save(i: any): Observable<CoreResponse<any>> {
        return this.httpClient.post<CoreResponse<any>>(this._BASE_URL + SAVE_URL, i);
    }

    // For updating data
    update(i: any): Observable<CoreResponse<any>> {
        return this.httpClient.put<CoreResponse<any>>(this._BASE_URL + UPDATE_URL, i);
    }

    // For deleting data
    delete(uuid: string): Observable<{ value: boolean }> {
        return this.httpClient.delete<{ value: boolean }>(this._BASE_URL + DELETE_URL + '/' + uuid);
    }

    // For getting by UUID set
    getByUuidSet(uuids: string[]): Observable<CoreResponse<any>> {
        return this.httpClient.post<CoreResponse<any>>(this._BASE_URL + GET_LIST_BY_UUID_SET_URL, { uuids: uuids });
    }

    // For getting by ID set
    getByIdSet(uuids: string[]): Observable<CoreResponse<any>> {
        return this.httpClient.post<CoreResponse<any>>(this._BASE_URL + GET_LIST_BY_ID_SET_URL, { uuids: uuids });
    }

}
