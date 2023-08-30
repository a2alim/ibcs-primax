import {Injectable} from '@angular/core';
import {environment} from '../../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AgencyDashboardModel} from "../models/agency-dashboard.model";

@Injectable({
    providedIn: 'root'
})
export class AgencyDashboardService {

    private BASE_API_URL: string = environment.ibcs.ppsPcBaseEndPoint;

    constructor(private http: HttpClient) {
    }

    getAgencyDashboardData(): Observable<AgencyDashboardModel> {
        const agencyDashboardUrl: string = this.BASE_API_URL + 'agency-dashboard';
        return this.http.get<AgencyDashboardModel>(agencyDashboardUrl);
    }

    getLocationData(): Observable<any> {
        return this.http.get<any>(this.BASE_API_URL + 'agency-dashboard/get-location-count-data');
    }
}
