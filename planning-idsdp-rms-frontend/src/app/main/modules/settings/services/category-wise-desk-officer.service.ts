import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs';
import { ApiService } from "../../../core/services/api/api.service";
import { CrudRequestService } from 'app/main/core/services/crud-request.service';
import { map } from 'rxjs/operators';


@Injectable({
    providedIn: 'root'
})
export class CategoryWiseDeskOfficerService extends CrudRequestService {

    baseRmsConfigurationApiEndPoint = environment.ibcs.rmsConfigurationBackend;

    constructor(private http: HttpClient) {
        super(http, environment.ibcs.rmsConfigurationBackend + 'api/category-wise-desk-officer/');
    }

    updateData(data): Observable<any> {
        const url = this.baseRmsConfigurationApiEndPoint + 'api/category-wise-desk-officer/update-category-wise-desk-officer';
        return this.http.put<any>(url, data).pipe(map((data: any) => data));
    }

    saveData(data): Observable<any> {
        const url = this.baseRmsConfigurationApiEndPoint + 'api/category-wise-desk-officer/create-category-wise-desk-officer';
        return this.http.post<any>(url, data).pipe(map((data: any) => data));
    }

    getActiveFiscalYearList(): Observable<any> {
        const url = this.baseRmsConfigurationApiEndPoint + 'api/fiscal-year/get-active-list';
        return this.http.get<any>(url).pipe(map((data: any) => data));
    }
}
