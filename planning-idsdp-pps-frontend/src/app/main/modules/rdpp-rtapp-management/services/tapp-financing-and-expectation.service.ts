import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CrudRequestService} from '../../../core/services/crud-request.service';
import {environment} from '../../../../../environments/environment';
import {TappFinancingAndExpectationModel} from '../models/tappFinancingAndExpectation.model';
import {map} from "rxjs/operators";
import {RdppRtappManagementModule} from "../rdpp-rtapp-management.module";

@Injectable({
  providedIn: 'root'
})
export class TappFinancingAndExpectationService extends CrudRequestService<TappFinancingAndExpectationModel>{

    constructor(private http: HttpClient) {
        super(http, environment.ibcs.ppsRdppRtappBackendPoint + 'financing-and-expectation/');
    }

    getFinancingExpectation(pcUuid){
        const url: string = environment.ibcs.ppsRdppRtappBackendPoint + 'financing-and-expectation/get-data' + '/' + pcUuid;
        return this.http.get(url).pipe(map((res: any) => {
            return res;
        }));
    }

    updateFinancingExpectation(model, pcUuid){
        const url: string = environment.ibcs.ppsRdppRtappBackendPoint + 'financing-and-expectation/update-data' + '/' + pcUuid;
        return this.http.put(url, model).pipe(map((res: any) => {
            return res;
        }));
    }


    createFinancingExpectation(model){
        const url: string = environment.ibcs.ppsRdppRtappBackendPoint + 'financing-and-expectation/create-financing-expectation';
        return this.http.post(url, model).pipe(map((res: any) => {
            return res;
        }));
    }
}
