import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {environment} from "../../../../environments/environment";


@Injectable({
    providedIn: 'root'
})
export class MisReportService{

    constructor(private httpClient: HttpClient) {
    }

    misReportList(model: any){
        const url: string = environment.ibcs.ppsDppBackendPoint + '/mis/apply-mis-query';
        return this.httpClient.post(url, model).pipe(map((res: any) => {
            return res;
        }));
    }



}
