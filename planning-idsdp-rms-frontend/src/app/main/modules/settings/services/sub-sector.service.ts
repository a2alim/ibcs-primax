import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../../../environments/environment';
import { from, Observable } from 'rxjs';
import { ApiService } from "../../../core/services/api/api.service";
import { CrudRequestService } from 'app/main/core/services/crud-request.service';
import { map } from 'rxjs/operators';


@Injectable({
    providedIn: 'root'
})
export class SubSectorService extends CrudRequestService {

    baseRmsConfigurationApiEndPoint = environment.ibcs.rmsConfigurationBackend;

    constructor(private http: HttpClient) {
        super(http, environment.ibcs.rmsConfigurationBackend + 'api/sub-sector/');
    }

    updateData(data): Observable<any> {
        const url = this.baseRmsConfigurationApiEndPoint + 'api/sub-sector/update-sub-sector';
        return this.http.put<any>(url, data).pipe(map((data: any) => data));
    }

    saveData(data): Observable<any> {
        const url = this.baseRmsConfigurationApiEndPoint + 'api/sub-sector/create-sub-sector';
        return this.http.post<any>(url, data).pipe(map((data: any) => data));
    }

    getAllActiveList() {
        const url = this.baseRmsConfigurationApiEndPoint + 'api/sub-sector/get-active-list';
        return this.http.get<any>(url).pipe(map((data: any) => data));
    }


    getBySectorId(sectorId): Observable<any> {
        const url = this.baseRmsConfigurationApiEndPoint + 'api/sub-sector/get-by-sector-id/' + sectorId;
        return this.http.get<any>(url).pipe(map((data: any) => data));
    }


}
