import {Injectable} from '@angular/core';
import {environment} from '../../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})

export class DashboardService {

    private baseUrl;

    constructor(private http: HttpClient) {
        this.baseUrl = environment.ibcs.ppsDppBackendPoint;
    }

    getDataList(route): Observable<any> {
        const url = this.baseUrl + route;
        return this.http.get(url);
    }

    getDppTappPresentation(sourceId, sourceModule):Observable<any>{
        const url = environment.ibcs.ppsDppBackendPoint + "presentations/get-presentation/" + sourceId + "/" + sourceModule;
        return this.http.get(url);
    }

    getGrandTotalByProjectConceptIdList(agencyId): Observable<number> {
        const url: string = environment.ibcs.ppsDppBackendPoint + 'dpp-dashboard/getGrandTotalByProjectConceptIdList/' + agencyId;
        return this.http.get(url).pipe(map((res: any) => {
            return res;
        }));
    }

    sendProjectData(model):Observable<any>{
        const url: string = environment.ibcs.ppsDppBackendPoint + 'project-info-to-gis/send-project-info-to-gis';
        return this.http.post(url, model).pipe(map((res: any) => {
            return res;
        }));
    }
}


