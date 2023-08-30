import {Injectable} from '@angular/core';

import {environment} from '../../../../../environments/environment';
import {ApiService} from "../../../core/services/api/api.service";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class ResearchCancellationServiceService {

    data: any;
    element: any;
    mode: any;
    download: any;

    baseRmsRpmApiEndPoint = environment.ibcs.rpmBackend;
    baseRmsConfigurationApiEndPoint = environment.ibcs.rmsConfigurationBackend;
    minioEndPointHost = environment.ibcs.minioEndPointHost;

    constructor(private apiService: ApiService,) {

    }

    save(data): Observable<any> {
        return this.apiService.post(this.baseRmsRpmApiEndPoint + 'api/research-action/save', data);
    }

    update(data): Observable<any> {
        return this.apiService.put(this.baseRmsRpmApiEndPoint + 'api/research-action/update', data);
    }

    delete(uuid): Observable<any> {
        return this.apiService.delete(this.baseRmsRpmApiEndPoint + 'api/research-action/delete/', uuid);
    }


    getResearchCancellationList(offset: number, pageSize: number): Observable<any> {
        const url = this.baseRmsRpmApiEndPoint + 'api/research-action/get-all';
        const pageableRequestBodyDTO = {
            page: offset,
            size: pageSize,
        };
        return this.apiService.post(url, pageableRequestBodyDTO);

    }

    saveFile(dataList, files: File[], updatedFileList: any[]) {
        const frmData = new FormData();

        frmData.append('body', JSON.stringify(dataList));

        if (updatedFileList != null) {

            for (var i = 0; i < updatedFileList.length; i++) {
                if (!updatedFileList[i]) {
                    updatedFileList[i] = 0;
                }
            }
        }
        updatedFileList = updatedFileList.filter(f => f != 0);
        frmData.append('updatedFileList', JSON.stringify(updatedFileList));

        if (files != null) {
            for (var i = 0; i < files.length; i++) {
                frmData.append('file', files[i]);
            }
        }

        const url = this.baseRmsRpmApiEndPoint + 'api/research-action-upload-doc/save';
        return this.apiService.post(url, frmData).pipe(map((data: any) => data));
    }

    getUploadFileList(id) {
        const api = this.baseRmsRpmApiEndPoint + `api/research-action-upload-doc/research-action-id/${id}`;
        return this.apiService.get(api);
    }

    getResearchTitleList(id){
        const url = this.baseRmsRpmApiEndPoint + `api/researcher-proposal/userid/${id}`;
        return this.apiService.get(url);
    }

    getResearchInformationById(id){
        const url = this.baseRmsRpmApiEndPoint + `api/agreement-with-researcher/getByResearcherProposalId/${id}`;
        return this.apiService.get(url);
    }
}
