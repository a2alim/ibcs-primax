import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {environment} from '../../../../../environments/environment';
import {Observable} from 'rxjs';
import {ApiService} from "../../../core/services/api/api.service";

@Injectable({
    providedIn: 'root'
})
export class PredefinedTemplateServiceService {
    baseRmsConfigurationApiEndPoint = environment.ibcs.rmsConfigurationBackend;

    constructor(private http: HttpClient, private apiService: ApiService,) {
    }

    updateData(data): Observable<any> {
        const url = this.baseRmsConfigurationApiEndPoint + 'api/predefine-template/update-predefine-template-unique';
        return this.apiService.update(url, data);

    }

    saveData(data): Observable<any> {
        const url = this.baseRmsConfigurationApiEndPoint + 'api/predefine-template/create-predefine-template-unique';
        return this.apiService.post(url, data);

    }

    getListData(page, pageSize): Observable<any> {
        const api = this.baseRmsConfigurationApiEndPoint + 'api/predefine-template/get-list/' + page + '/' + pageSize;
        return this.apiService.get(api);
    }

    delete(rowUuid) {
        const api = this.baseRmsConfigurationApiEndPoint + 'api/predefine-template/delete/';
        return this.apiService.delete(api, rowUuid);
    }

    getAll() {
        const api = this.baseRmsConfigurationApiEndPoint + 'api/predefine-template/get-list';
        return this.apiService.get(api);
    }

    getAllByTemplateType(templateType) {
        const api = this.baseRmsConfigurationApiEndPoint + 'api/predefine-template/get-all-by-id-active/'+templateType;
        return this.apiService.get(api);
    }

    getByTemplateTypeId(templateTypeId: number) {
        const api = this.baseRmsConfigurationApiEndPoint + 'api/predefine-template/get-all-by-id-active/' + templateTypeId;
        return this.apiService.get(api);
    }

}
