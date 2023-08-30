import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {environment} from '../../../../../environments/environment';
import {Observable} from 'rxjs';
import {CrudRequestService} from 'app/main/core/services/crud-request.service';
import {map} from 'rxjs/operators';


@Injectable({
    providedIn: 'root'
})
export class ResearchCategoryTypeService extends CrudRequestService {

    baseRmsConfigurationApiEndPoint = environment.ibcs.rmsConfigurationBackend;

    constructor(private http: HttpClient) {
        super(http, environment.ibcs.rmsConfigurationBackend + 'api/research-category-type/');
    }

    getAllActiveListById(id) {
        const url = this.baseRmsConfigurationApiEndPoint + 'api/research-category-type/get-by-id/'+ id;
        return this.http.get<any>(url).pipe(map((data: any) => data));
    }

    getAllActiveList() {
        const url = this.baseRmsConfigurationApiEndPoint + 'api/research-category-type/get-active-list';
        return this.http.get<any>(url).pipe(map((data: any) => data));
    }

    updateData(data): Observable<any> {
        const url = this.baseRmsConfigurationApiEndPoint + 'api/research-category-type/update-research-category-type';
        return this.http.put<any>(url, data).pipe(map((data: any) => data));
    }

    saveData(data): Observable<any> {
        const url = this.baseRmsConfigurationApiEndPoint + 'api/research-category-type/create-research-category-type';
        return this.http.post<any>(url, data).pipe(map((data: any) => data));
    }

    geResearchCategorytList() {
        const url = this.baseRmsConfigurationApiEndPoint + 'api/research-category-type/get-list';
        return this.http.get<any>(url).pipe(map((data: any) => data));
    }
}
