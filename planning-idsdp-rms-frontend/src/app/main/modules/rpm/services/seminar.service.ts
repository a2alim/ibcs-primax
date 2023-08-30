import { Injectable } from '@angular/core';

import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs';
import { ApiService } from "../../../core/services/api/api.service";

@Injectable({
    providedIn: 'root'
})
export class SeminarService {

    baseRmsRpmApiEndPoint = environment.ibcs.rpmBackend;
    baseRmsConfigurationApiEndPoint = environment.ibcs.rmsConfigurationBackend;


    constructor(private apiService: ApiService,) {

    }

    saveSeminar(data): Observable<any> {
        const url = this.baseRmsRpmApiEndPoint + 'api/create-seminar/create';
        return this.apiService.post(url, data);

    }

    saveTimeSchedule(data): Observable<any> {
        const url = this.baseRmsRpmApiEndPoint + 'api/seminar-time-schedule/create';
        return this.apiService.post(url, data);
    }

    updateTimeSchedule(data): Observable<any> {
        const url = this.baseRmsRpmApiEndPoint + 'api/seminar-time-schedule/update';
        return this.apiService.put(url, data);
    }


    saveTimeScheduleSeminar(timeScheduleList: any): Observable<any> {
        console.log(timeScheduleList)
        const url = this.baseRmsRpmApiEndPoint + 'api/seminar-time-schedule/create-list';
        return this.apiService.post(url, timeScheduleList);
    }

    updateTimeScheduleSeminar(timeScheduleList: any): Observable<any> {
        console.log(timeScheduleList)
        const url = this.baseRmsRpmApiEndPoint + 'api/seminar-time-schedule/update-list';
        return this.apiService.put(url, timeScheduleList);
    }

    deleteTimeScheduleSeminar(uuid) {
        const url = this.baseRmsRpmApiEndPoint + 'api/seminar-time-schedule/delete/';
        return this.apiService.delete(url, uuid);
    }

    saveSeminarPerticipent(data: any) {
        const url = this.baseRmsRpmApiEndPoint + 'api/participating-seminar/create';
        return this.apiService.post(url, data);
    }

    getSeminarList(startPage: number, endNumber: number): Observable<any> {
        const url = this.baseRmsRpmApiEndPoint + 'api/create-seminar/get-list/' + startPage + '/' + endNumber;
        return this.apiService.get(url);
    }

    deleteSeminar(uuid: string) {
        const url = this.baseRmsRpmApiEndPoint + 'api/create-seminar/delete/';
        return this.apiService.delete(url, uuid);
    }

    getSeminarById(id: any): Observable<any> {
        const url = this.baseRmsRpmApiEndPoint + 'api/create-seminar/view-details/' + id + '/update';
        return this.apiService.get(url);
    }

    seminarDetailsFindBySeminarId(id: any): Observable<any> {
        const url = this.baseRmsRpmApiEndPoint + 'api/create-seminar/view/' + id;
        return this.apiService.get(url);
    }

    getSeminarTimeScheduleListBySeminarId(id: any): Observable<any> {
        const url = this.baseRmsRpmApiEndPoint + 'api/seminar-time-schedule/find-all-by-seminar-id/' + id;
        return this.apiService.get(url);
    }

    updateSeminar(seminarModelForCreate: any) {
        const url = this.baseRmsRpmApiEndPoint + 'api/create-seminar/update';
        return this.apiService.update(url, seminarModelForCreate);
    }

    seminarIsExists(seminarId: number) {
        const url = this.baseRmsRpmApiEndPoint + 'api/seminar-time-schedule/seminar-is-exists/' + seminarId;
        return this.apiService.get(url);
    }

    updateSeminarPerticipent(data: any) {
        const url = this.baseRmsRpmApiEndPoint + 'api/participating-seminar/update';
        return this.apiService.update(url, data);
    }
}
