import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CrudRequestService} from '../../../core/services/crud-request.service';
import {CategoryEnvironmentModel} from '../models/categoryEnvironmentModel.model';
import {Observable} from 'rxjs';
import {CATEGORY, GET_ACTIVE_CATEGORY} from "../constants/category-environment.constant";


@Injectable({
    providedIn: 'root'
})
export class CategoryEnvironmentService extends CrudRequestService<CategoryEnvironmentModel> {


    constructor(private http: HttpClient) {
        super(http, CATEGORY);
    }

    getAllActiveCategoryEnvironmentList(): Observable<CategoryEnvironmentModel[]> {
        return this.http.get<CategoryEnvironmentModel[]>(this._BASE_URL + GET_ACTIVE_CATEGORY);
    }

}
