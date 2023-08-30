import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../../environments/environment';
import {map} from 'rxjs/operators';
import {RdppRtappManagementModule} from "../rdpp-rtapp-management.module";


@Injectable({
    providedIn: 'root'
})
export class DppAmortizationScheduleService{

    constructor(private httpClient: HttpClient) {

    }


    getAmortizationSchedule(pcUuid){
        const url: string = environment.ibcs.ppsDppBackendPoint + 'dppAmortizationSchedule/getAmortization' + '/' + pcUuid;
        return this.httpClient.get(url).pipe(map((res: any) => {
            return res;
        }));
    }

    getRdppAmortizationSchedule(rdppMasterId){
        const url: string = environment.ibcs.ppsRdppRtappBackendPoint + 'rdpp-amortization-schedule/getAmortization' + '/' + rdppMasterId;
        return this.httpClient.get(url).pipe(map((res: any) => {
            return res;
        }));
    }



    createAmortizationSchedule(model){
        const url: string = environment.ibcs.ppsRdppRtappBackendPoint + 'rdpp-amortization-schedule/createAmortizationSchedule';
        return this.httpClient.post(url, model).pipe(map((res: any) => {
            return res;
        }));
    }


    updateAmortization(model, rdppUuid: any){
        const url: string = environment.ibcs.ppsRdppRtappBackendPoint + 'rdpp-amortization-schedule/updateAmortization' + '/' + rdppUuid;
        return this.httpClient.put(url, model).pipe(map((res: any) => {
            return res;
        }));
    }

}
