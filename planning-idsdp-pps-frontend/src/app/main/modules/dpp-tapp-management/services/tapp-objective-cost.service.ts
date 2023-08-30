import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CrudRequestService} from '../../../core/services/crud-request.service';
import {environment} from '../../../../../environments/environment';
import {map} from 'rxjs/operators';
import {TappObjectiveCostModel} from '../models/tappObjectiveCost.model';
import {Observable} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class TappObjectiveCostService extends CrudRequestService<TappObjectiveCostModel> {

    urld: String;

    constructor(private http: HttpClient) {
        super(http, environment.ibcs.ppsDppBackendPoint);
        this.urld = environment.ibcs.ppsDppBackendPoint + "tapp-objective-cost/";
    }

    getProjectConceptByUuid(pcUuid) {
        const url: string = this.urld + 'get-by-PcUuid/' + pcUuid;
        return this.http.get(url).pipe(map((res: any) => {
            return res;
        }));
    }

    createObjectiveCost(data: any, updates: boolean): any {

        let action = 'save';
        if (updates) {
            action = 'update';
        }

        const url: string = this.urld + action;
        return this.http.post(url, data).pipe(map((res: any) => {
            return res;
        }));
    }

    deleteRow(rowUuid) {
        const url: string = this.urld + 'deleteRow/' + rowUuid;
        return this.http.delete(url);
    }

    getTappObjectiveCostList(): Observable<TappObjectiveCostModel[]> {
        const url: string = environment.ibcs.ppsDppBackendPoint + 'tapp-objective-cost/get-tapp-master-data';
        return this.http.get(url).pipe(map((res: any) => {
            return res;
        }));
    }

    getTappObjectiveCostByPcUuid(uuid: string): Observable<TappObjectiveCostModel> {
        const url: string = environment.ibcs.ppsDppBackendPoint + 'tapp-objective-cost/get-tapp-master-data/' + uuid;
        return this.http.get(url).pipe(map((res: any) => {
            return res;
        }));
    }
}
