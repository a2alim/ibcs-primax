import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../../environments/environment';
import {map} from 'rxjs/operators';


@Injectable({
    providedIn: 'root'
})
export class RdppReportService {
    BASE_URL = "/get-report/";

    constructor(private httpClient: HttpClient) {

    }

    getObjectiveCost(pcUuid) {
        const url: string = environment.ibcs.ppsRdppRtappBackendPoint + this.BASE_URL +'get-rdpp-project-summary-by' + '/' + pcUuid;
        return this.httpClient.get(url).pipe(map((res: any) => {
            return res;
        }));
    }

}
