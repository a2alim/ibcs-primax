import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PmPdSelectionModel } from '../models/pm-pd-selection.model';
import {PmViewSelectionModel} from "../models/pm-view-schedule.model";

@Injectable({
  providedIn: 'root'
})
export class PmVisitScheduleService {

    private baseUrl;

    constructor(private http: HttpClient) {
        this.baseUrl = environment.ibcs.ppsProjectManagementBackendPoint;
    }


    createVisitSelection(data: PmViewSelectionModel): Observable<any> {
    const route=this.baseUrl+'view-schedule/create-schedule';
        const formData = new FormData();
        formData.append('data', JSON.stringify(data));
        formData.append('file',data.attachedFile);
            return this.http.post(route, formData);
        }

        getScheduleList(offset,pageSize):Observable<any>{
            const route=this.baseUrl+'view-schedule/get-list/'+offset+'/'+pageSize;
            return this.http.get(route);

        }

    getViewListByDppTappMasterUuid(dppTappMasterUuid: string): Observable<any> {
        const param = new HttpParams().append('dppTappMasterUuid', dppTappMasterUuid);
        const url: string = this.baseUrl + 'view-schedule/get-view-schedule-list';
        return this.http.get(url, { params: param }).pipe(map((res: any) => res));
    }

    deleteViewSelectionByUuid(uuid){
        const param = new HttpParams().append('uuid', uuid);
        const url: string = this.baseUrl + 'view-schedule/delete-by-uuid';
        return this.http.delete(url, { params: param }).pipe(map((res: any) => res));
    }

    sotDeleteViewSelectionByUuid(uuid){
        const url: string = this.baseUrl + 'view-schedule/delete/'+uuid;
        return this.http.delete(url).pipe(map((res: any) => res));
    }

}
