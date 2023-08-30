import {Injectable} from '@angular/core';
import {environment} from '../../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {RdppRtappManagementModule} from "../rdpp-rtapp-management.module";

@Injectable({
    providedIn: 'root'
})


export class DashboardService  {

    private baseUrl;

    constructor( private http: HttpClient)
    {
        this.baseUrl = environment.ibcs.ppsRdppRtappBackendPoint;
    }

    getDataList(route): Observable<any> {
        const url = this.baseUrl + route;
        return this.http.get(url);
    }

}
