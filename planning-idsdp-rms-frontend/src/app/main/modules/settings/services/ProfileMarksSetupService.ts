import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {environment} from '../../../../../environments/environment';
import {Observable} from 'rxjs';
import {ApiService} from "../../../core/services/api/api.service";


@Injectable({
    providedIn: 'root'
})
export class ProfileMarksSetupService {

    baseRmsConfigurationApiEndPoint = environment.ibcs.rmsConfigurationBackend;

    constructor(private http: HttpClient, private apiService: ApiService,) {}

    getListData(page, pageSize): Observable<any> {
        const api = this.baseRmsConfigurationApiEndPoint + 'api/profile-marks-setup/get-list/' + page + '/' + pageSize;
        return this.apiService.get(api);
    }

    getDataByUuid(uuid): Observable<any> {
        const api = this.baseRmsConfigurationApiEndPoint + 'api/profile-marks-setup/get-by-uuid/'+uuid;
        return this.apiService.get(api);
    }

    updateData(data): Observable<any> {
        const url = this.baseRmsConfigurationApiEndPoint + 'api/profile-marks-setup/update';
        return this.apiService.update(url, data);
    }

    saveData(data): Observable<any> {

        const url = this.baseRmsConfigurationApiEndPoint + 'api/profile-marks-setup/create';
        return this.apiService.post(url, data);
    }

    deleteDataById(uuid): Observable<any> {
        const url = this.baseRmsConfigurationApiEndPoint + 'api/profile-marks-setup/delete/';
        return this.apiService.delete(url, uuid);
    }

    getProfileMarksSetupDataByResearchCategoryId(id): Observable<any> {
        //const api = this.baseRmsConfigurationApiEndPoint + 'api/profile-marks-setup/find-by-St-research-cat-type-id/'+id;
        const api = this.baseRmsConfigurationApiEndPoint + 'api/profile-marks-setup/get-marks-setup-by-rCat-id/'+id;
        return this.apiService.get(api);
    }
    
}
