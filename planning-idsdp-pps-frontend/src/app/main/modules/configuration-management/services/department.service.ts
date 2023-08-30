import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CrudRequestService} from '../../../core/services/crud-request.service';
import {Observable} from 'rxjs';
import {IResponseBody} from '../../../core/models/response';
import {Department} from '../models/department.model';
import {DEPARTMENT, GET_ACTIVE_DEPARTMENT} from '../constants/department.constant';

@Injectable({
    providedIn: 'root'
})
export class DepartmentService extends CrudRequestService<Department> {

    baseUrl = '';

    constructor(private http: HttpClient) {
        super(http, DEPARTMENT);
    }

    // for get ActiveDepartment
    getActiveDepartment(page?: number, size?: number): Observable<IResponseBody<Department>> {
        return this.http.get<IResponseBody<Department>>(this._BASE_URL + GET_ACTIVE_DEPARTMENT + '/' + page + '/' + size);
    }

}
