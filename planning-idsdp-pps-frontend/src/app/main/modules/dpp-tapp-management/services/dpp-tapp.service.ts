import {Injectable} from '@angular/core';
import {environment} from '../../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {map} from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class DppTappService {

    private baseUrl;
    private BASE_API_URL: string = environment.ibcs.configurationApiEndPoint;

    constructor(private http: HttpClient) {
        this.baseUrl = environment.ibcs.ppsDppBackendPoint;
    }

    getGreenPageList(ministryCode, agencyCode, financialYear, programType){
        const url: string = this.baseUrl + 'ams/get-green-page-list' + '/' + ministryCode + '/' + agencyCode + '/' + financialYear + '/' + programType;
        return this.http.get(url).pipe(map((res: any) => {
            return res;
        }));
    }

    sendProjectToAms(pcId){
        const formData = new FormData();
        const url: string = this.baseUrl + 'ams/send-project-to-ams-by-pps-id' + '/' + pcId;
        return this.http.post(url, formData).pipe(map((res: any) => {
            return res;
        }));
    }
}
