import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CrudRequestService} from '../../../core/services/crud-request.service';
import {environment} from '../../../../../environments/environment';
import {map} from 'rxjs/operators';
import {TappObjectiveCostModel} from '../models/tappObjectiveCost.model';
import {Observable} from "rxjs";
import {RdppRtappManagementModule} from "../rdpp-rtapp-management.module";
import {PageableRequestBodyModel} from "../models/pageable-request-body-model";

@Injectable({
    providedIn: 'root'
})
export class TappObjectiveCostService extends CrudRequestService<TappObjectiveCostModel> {

    urld: string;
    dppUrl: string;

    constructor(private http: HttpClient) {
        super(http, environment.ibcs.ppsRdppRtappBackendPoint);
        this.urld = environment.ibcs.ppsRdppRtappBackendPoint + "tapp-objective-cost/";
        this.dppUrl = environment.ibcs.ppsDppBackendPoint + "tapp-objective-cost/";
    }

    getProjectConceptByUuid(id) {
        const url: string = this.urld + 'get-by-rtapp-id/' + id;
        return this.http.get(url).pipe(map((res: any) => {
            return res;
        }));
    }

    getObjCostProjectConceptByUuid(pcUuid) {
        const url: string = this.dppUrl + 'get-by-PcUuid/' + pcUuid;
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
        const url: string = environment.ibcs.ppsRdppRtappBackendPoint + 'tapp-objective-cost/get-tapp-master-data';
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

    getObjectiveCostByRtappMasterId(rtappMasterId: number): Observable<TappObjectiveCostModel> {
        const url: string = environment.ibcs.ppsRdppRtappBackendPoint + 'tapp-objective-cost/get-rtapp-master-data/' + rtappMasterId;
        return this.http.get(url).pipe(map((res: any) => {
            return res;
        }));
    }

    getRTappObjectiveCostByPcUuid(uuid: string, id): Observable<TappObjectiveCostModel> {
        const url: string = environment.ibcs.ppsRdppRtappBackendPoint + 'tapp-objective-cost/get-tapp-master-data/' + uuid + '/' + id;
        return this.http.get(url).pipe(map((res: any) => {
            return res;
        }));
    }


    getRtappList(page?: number, size?: number): any {
        let requestBodyDTO = new PageableRequestBodyModel();
        requestBodyDTO.page = page;
        requestBodyDTO.size = size;
        return this.http.post(environment.ibcs.ppsRdppRtappBackendPoint + 'tapp-objective-cost/get-rtapp-list', requestBodyDTO).pipe(map((res: any) => {
            console.log('call from service');
            console.log(res);
            return res;
        }));
    }

    checkCurrentRtappProjectVersionById(id: any): any {
        const url: string = environment.ibcs.ppsRdppRtappBackendPoint + 'tapp-objective-cost/check-current-project-version/' + id;
        return this.http.get(url).pipe(map((res: any) => {
            return res;
        }));
    }

    getObjectiveCostByReferenceUuid(referenceUuid){
        const url: string = environment.ibcs.ppsRdppRtappBackendPoint + 'tapp-objective-cost/find-objective-cost-by-reference-uuid/' + referenceUuid;
        return this.http.get(url).pipe(map((res: any) => { return res; }));
    }

    findObjectiveCostByUuid(uuid){
        const url: string = environment.ibcs.ppsRdppRtappBackendPoint + 'tapp-objective-cost/find-objective-cost-by-uuid/' + uuid;
        return this.http.get(url).pipe(map((res: any) => { return res; }));
    }

    getCumulativeDate(rtappMasterId: number, conceptUuid: string): any {
        return this.http.get(environment.ibcs.ppsRdppRtappBackendPoint + 'tapp-objective-cost/get-cumulative-date/' + rtappMasterId + '/' + conceptUuid);
    }

    getEstimatedCosts(conceptUuid: string): Observable<any> {
        const url: string = environment.ibcs.ppsRdppRtappBackendPoint + 'tapp-objective-cost/estimated-cost/' + conceptUuid;
        return this.http.get(url);
    }

    updateMainFeaturesRevision(rtappMasterId: number, mainFeaturesOfRevision: string): any {
        const data = {
            rtappMasterId: rtappMasterId,
            mainFeaturesRevision: mainFeaturesOfRevision
        }

        const url: string = this.urld + 'update-main-features-revision';
        return this.http.post(url, data).pipe(map((res: any) => {
            return res;
        }));
    }
}
