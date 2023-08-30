import {Injectable} from '@angular/core';

import {environment} from '../../../../../environments/environment';
import {BehaviorSubject, Observable} from 'rxjs';
import {ApiService} from "../../../core/services/api/api.service";

@Injectable({
    providedIn: 'root'
})
export class RmsDashboardService {

    baseRmsRpmApiEndPoint = environment.ibcs.rpmBackend;

    constructor(private apiService: ApiService,) {

    }


    getRmsDashboardData(): Observable<any> {
        const api = this.baseRmsRpmApiEndPoint + 'api/rms/dashboard/view';
        return this.apiService.get(api);
    }

    getRmsDashboardDataByFiscalYear(value: any) {

        const api = this.baseRmsRpmApiEndPoint + 'api/rms/dashboard/view/'+value;
        return this.apiService.get(api);
    }
}
