import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs';
import { ApiService } from "../../../core/services/api/api.service";


@Injectable({
  providedIn: 'root'
})
export class UserSerializationServiceService {

  baseRmsConfigurationApiEndPoint = environment.ibcs.rmsConfigurationBackend;

  constructor(private http: HttpClient, private apiService: ApiService,) {
  }


  updateData(data): Observable<any> {
    const url = this.baseRmsConfigurationApiEndPoint + 'api/user-serialization/update-user-serialization-unique';
    return this.apiService.update(url, data);

}

saveData(data): Observable<any> {
    const url = this.baseRmsConfigurationApiEndPoint + 'api/user-serialization/create-user-serialization-unique';
    return this.apiService.post(url, data);

}

getListData(page, pageSize): Observable<any> {
    const api = this.baseRmsConfigurationApiEndPoint + 'api/user-serialization/get-list/' + page + '/' + pageSize;
    return this.apiService.get(api);
}

delete(rowUuid) {
    const api = this.baseRmsConfigurationApiEndPoint + 'api/user-serialization/delete/';
    return this.apiService.delete(api, rowUuid);
}

getAll() {
    const api = this.baseRmsConfigurationApiEndPoint + 'api/user-serialization/get-list';
    return this.apiService.get(api);
}

getAllActive() {
  const api = this.baseRmsConfigurationApiEndPoint + 'api/user-serialization/get-active-list';
  return this.apiService.get(api);
}

getAllUser() {
  const api = this.baseRmsConfigurationApiEndPoint + 'api/user/all';
  return this.apiService.get(api);
}

  }
