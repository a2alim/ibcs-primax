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
export class CommitteeMemberService extends CrudRequestService {

    baseRmsConfigurationApiEndPoint = environment.ibcs.rmsConfigurationBackend;

    constructor(private http: HttpClient) {
        super(http, environment.ibcs.rmsConfigurationBackend + 'api/committee-setup/');
    }

    getAllActiveList() {
        const url = this.baseRmsConfigurationApiEndPoint + 'api/add-member-in-committee/get-active-data';
        return this.http.get<any>(url).pipe(map((data: any) => data));
    }

}
