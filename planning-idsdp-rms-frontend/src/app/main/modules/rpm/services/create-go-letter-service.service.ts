import {Injectable} from '@angular/core';

import {environment} from '../../../../../environments/environment';
import {ApiService} from "../../../core/services/api/api.service";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class CreateGoLetterServiceService {

    data: any;
    element: any;
    mode: any;
    download: any;

    baseRmsRpmApiEndPoint = environment.ibcs.rpmBackend;
    baseRmsConfigurationApiEndPoint = environment.ibcs.rmsConfigurationBackend;
    minioEndPointHost = environment.ibcs.minioEndPointHost;

    constructor(private apiService: ApiService,) {

    }

    getGoLetterInfo(id: string): Observable<any> {
        return this.apiService.get(this.baseRmsRpmApiEndPoint + `api/go-letter/get-by-uuid/${id}`);
    }

    saveData(data): Observable<any> {
        return this.apiService.post(this.baseRmsRpmApiEndPoint + 'api/go-letter/create', data);
    }

    updateData(data): Observable<any> {
        return this.apiService.put(this.baseRmsRpmApiEndPoint + 'api/go-letter/update/'+data.uuid, data);
    }

    delete(id): Observable<any> {
        return this.apiService.delete(this.baseRmsRpmApiEndPoint + 'api/go-letter/deletebyid/', +id);
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

        const url = this.baseRmsRpmApiEndPoint + 'api/goletter-upload-doc/save';
        return this.apiService.post(url, frmData).pipe(map((data: any) => data));
    }

    findByGeoLetterId(id){
        const url = this.baseRmsRpmApiEndPoint + 'api/goletter-upload-doc/getbygoletterid/' + id;
        return this.apiService.get(url).pipe(map((data: any) => data));
    }


    getAllActiveTemplateType() {
        const api = this.baseRmsConfigurationApiEndPoint + 'api/template-type/active';
        return this.apiService.get(api);
    }

    getPredefineTemplateTypeBySelectedTemplateType(data) {
        const api = this.baseRmsConfigurationApiEndPoint + 'api/predefine-template/get-by-template-type-id/' + data;
        return this.apiService.get(api);
    }

    getInstallmentProcessById(data) {
        const api = this.baseRmsRpmApiEndPoint + 'api/installment-process/getbyid/' + data;
        return this.apiService.get(api);
    }

    getGoLetterList(offset: number, pageSize: number): Observable<any> {
        const url = this.baseRmsRpmApiEndPoint + 'api/go-letter/getall';
        const pageableRequestBodyDTO = {
            page: offset,
            size: pageSize,
        };
        return this.apiService.post(url, pageableRequestBodyDTO);

    }


    getGoLetterByUuid(uuid) {
        const api = this.baseRmsRpmApiEndPoint + 'apie/go-letter/getGobyuuid/'+uuid;
        return this.apiService.get(api);
    }


    deleteGoLetterByUuid(uuid) {
        const api = this.baseRmsRpmApiEndPoint + 'api/go-letter/delete/';
        return this.apiService.delete(api,uuid);
    }

    downloadFile(filename : string): any {
        return this.apiService.get(this.baseRmsRpmApiEndPoint + '/download/' + filename);
    }

}
