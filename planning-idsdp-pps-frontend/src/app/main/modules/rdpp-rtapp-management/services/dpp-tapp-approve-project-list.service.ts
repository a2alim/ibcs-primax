import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from "../../../../../environments/environment";
import { map } from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})


export class DppTappApproveProjectListService {

    private baseUrl;

    constructor(private http: HttpClient) {
        this.baseUrl = environment.ibcs.ppsDppBackendPoint;
    }

    getApproveDppTappList(agencyId) {
        const url: string = environment.ibcs.ppsDppBackendPoint + 'project-movement-stage/get-approved-project-by-agency-id/'+agencyId;
        return this.http.get(url).pipe(map((res: any) => {
            return res;
        }));
    }

}
