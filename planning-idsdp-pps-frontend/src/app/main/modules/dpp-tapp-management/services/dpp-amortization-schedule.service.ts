import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CrudRequestService} from '../../../core/services/crud-request.service';
import {environment} from '../../../../../environments/environment';
import {map} from 'rxjs/operators';
import { DppAmortizationSchedule } from '../models/DppAmortizationSchedule.model';


@Injectable({
    providedIn: 'root'
})
export class DppAmortizationScheduleService{

    constructor(private httpClient: HttpClient) {

    }

    getAmortization(pcUuid) {

        const url: string = environment.ibcs.ppsDppBackendPoint + 'dppAmortizationSchedule/getSchedule' + '/' + pcUuid;
        return this.httpClient.get(url).pipe(map((res: any) => {
            return res;
        }));
    }

    getAmortizationSchedule(pcUuid){
        const url: string = environment.ibcs.ppsDppBackendPoint + 'dppAmortizationSchedule/getAmortization' + '/' + pcUuid;
        return this.httpClient.get(url).pipe(map((res: any) => {
            return res;
        }));
    }



    saveAmortizationSchedule(model){
        const url: string = environment.ibcs.ppsDppBackendPoint + 'dppAmortizationSchedule/create';
        return this.httpClient.post(url, model).pipe(map((res: any) => {
            return res;
        }));
    }

    createAmortizationSchedule(model){
        console.log("From Service");
        console.log(model);

        const url: string = environment.ibcs.ppsDppBackendPoint + 'dppAmortizationSchedule/createAmortizationSchedule';
        return this.httpClient.post(url, model).pipe(map((res: any) => {
            return res;
        }));
    }

    updateAmortizationSchedule(model, projectId: any){
        const url: string = environment.ibcs.ppsDppBackendPoint + 'dppAmortizationSchedule/updateSchedule' + '/' + projectId;
        return this.httpClient.put(url, model).pipe(map((res: any) => {
            return res;
        }));
    }

    updateAmortization(model, projectId: any){
        const url: string = environment.ibcs.ppsDppBackendPoint + 'dppAmortizationSchedule/updateAmortization' + '/' + projectId;
        return this.httpClient.put(url, model).pipe(map((res: any) => {
            return res;
        }));
    }

}
