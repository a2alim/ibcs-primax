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
export class CommitteeSetupService extends CrudRequestService {

    baseRmsConfigurationApiEndPoint = environment.ibcs.rmsConfigurationBackend;

    constructor(private http: HttpClient) {
        super(http, environment.ibcs.rmsConfigurationBackend + 'api/committee-setup/');
    }

    getAllActiveList() {
        const url = this.baseRmsConfigurationApiEndPoint + 'api/committee-setup/get-active-list';
        return this.http.get<any>(url).pipe(map((data: any) => data));
    }

    updateData(data): Observable<any> {
        const url = this.baseRmsConfigurationApiEndPoint + 'api/committee-setup/update';
        return this.http.put<any>(url, data).pipe(map((data: any) => data));
    }

    saveData(data): Observable<any> {
        const url = this.baseRmsConfigurationApiEndPoint + 'api/committee-setup/create';
        return this.http.post<any>(url, data).pipe(map((data: any) => data));
    }

}
