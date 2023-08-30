import {Injectable} from '@angular/core';

import {environment} from '../../../../../environments/environment';
import {ApiService} from "../../../core/services/api/api.service";
import {Observable} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class SubmitProgressReportServiceService {

    data: any;
    element: any;
    mode: any;
    download: any;
    id: any;

    baseRmsRpmApiEndPoint = environment.ibcs.rpmBackend;
    baseRmsConfigurationApiEndPoint = environment.ibcs.rmsConfigurationBackend;
    minioEndPointHost = environment.ibcs.minioEndPointHost;

    constructor(private apiService: ApiService,) {

    }

    saveData(files: any, data): Observable<any> {
        const url = this.baseRmsRpmApiEndPoint + 'api/research-progress-report/save';
        const formData = new FormData();
        files.forEach(res => {
            formData.append('file', res.file)
        })
        formData.append('body', JSON.stringify(data));
        return this.apiService.post(url, formData);
    }

    updateData(data): Observable<any> {
        const url = this.baseRmsRpmApiEndPoint + 'api/research-progress-report/update';
        return this.apiService.update(url, data);
    }

    delete(uuid) {
        return this.apiService.delete(this.baseRmsRpmApiEndPoint + 'api/research-progress-report/delete/', uuid);
    }

    getSubmitProgressList(offset: number, pageSize: number): Observable<any> {
        const url = this.baseRmsRpmApiEndPoint + 'api/research-progress-report/get-all';
        const pageableRequestBodyDTO = {
            page: offset,
            size: pageSize,
        };
        return this.apiService.post(url, pageableRequestBodyDTO);
    }

    getResearchInfoDataByUuid(uuid: string): Observable<any> {
        return this.apiService.get(this.baseRmsRpmApiEndPoint + `api/researcher-proposal/get-by-uuid/${uuid}`);
    }

    getResearchInfo(): Observable<any> {
        return this.apiService.get(this.baseRmsRpmApiEndPoint + 'api/researcher-proposal/get-all');
    }

    // Api Called For Task List
    save(data): Observable<any> {
        return this.apiService.post(this.baseRmsRpmApiEndPoint + 'api/task-list/save', data);
    }

    update(data): Observable<any> {
        return this.apiService.post(this.baseRmsRpmApiEndPoint + 'api/task-list/update', data);
    }

    DeleteTask(uuid): Observable<any> {
        return this.apiService.delete(this.baseRmsRpmApiEndPoint + 'api/task-list/delete/', uuid);
    }

}
