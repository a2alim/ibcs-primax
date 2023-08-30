import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs';
import { ApiService } from "../../../core/services/api/api.service";

@Injectable({
  providedIn: 'root'
})
export class InstallmentPayRulesService {
  baseRmsConfigurationApiEndPoint = environment.ibcs.rmsConfigurationBackend;

  constructor(private http: HttpClient, private apiService: ApiService,) {
  }


//   updateData(data): Observable<any> {
//     const url = this.baseRmsConfigurationApiEndPoint + 'api/installment-pay-rule/update-installment-pay-rule-unique';
//     return this.apiService.update(url, data);

// }

updateData(data): Observable<any> {
  const url = this.baseRmsConfigurationApiEndPoint + 'api/installment-pay-rule/update';
  return this.apiService.update(url, data);

}

// saveData(data): Observable<any> {
//     const url = this.baseRmsConfigurationApiEndPoint + 'api/installment-pay-rule/create-installment-pay-rule-unique';
//     return this.apiService.post(url, data);

// }


saveData(data): Observable<any> {
  const url = this.baseRmsConfigurationApiEndPoint + 'api/installment-pay-rule/create';
  return this.apiService.post(url, data);

}

getListData(page, pageSize): Observable<any> {
    const api = this.baseRmsConfigurationApiEndPoint + 'api/installment-pay-rule/get-list/' + page + '/' + pageSize;
    return this.apiService.get(api);
}

delete(rowUuid) {
    const api = this.baseRmsConfigurationApiEndPoint + 'api/installment-pay-rule/delete/';
    return this.apiService.delete(api, rowUuid);
}

getAll() {
    const api = this.baseRmsConfigurationApiEndPoint + 'api/installment-pay-rule/get-list';
    return this.apiService.get(api);
}

  }

