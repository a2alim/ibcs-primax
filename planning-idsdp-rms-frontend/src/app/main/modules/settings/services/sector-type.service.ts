import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs';
import { ApiService } from "../../../core/services/api/api.service";
import { map } from 'rxjs/operators';
import { CrudRequestService } from 'app/main/core/services/crud-request.service';


@Injectable({
    providedIn: 'root'
})
export class SectorTypeService extends CrudRequestService {

    baseRmsConfigurationApiEndPoint = environment.ibcs.rmsConfigurationBackend;

    constructor(private http: HttpClient) {
        super(http, environment.ibcs.rmsConfigurationBackend + 'api/sector-type/');
    }


    updateData(data): Observable<any> {
        const url = this.baseRmsConfigurationApiEndPoint + 'api/sector-type/update-sector-type';
        return this.http.put<any>(url, data).pipe(map((data: any) => data));
    }

    saveData(data): Observable<any> {
        const url = this.baseRmsConfigurationApiEndPoint + 'api/sector-type/create-sector-type';
        return this.http.post<any>(url, data).pipe(map((data: any) => data));
    }

    getAllActiveList() {
        const url = this.baseRmsConfigurationApiEndPoint + 'api/sector-type/get-active-list';
        return this.http.get<any>(url).pipe(map((data: any) => data));
    }
}
