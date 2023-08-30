import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs';
import { ApiService } from "../../../core/services/api/api.service";

@Injectable({
  providedIn: 'root'
})
export class CategoryWiseGrantAmountServiceService {

  baseRmsConfigurationApiEndPoint = environment.ibcs.rmsConfigurationBackend;

  constructor(private http: HttpClient, private apiService: ApiService,) {
  }


  updateData(data): Observable<any> {
    const url = this.baseRmsConfigurationApiEndPoint + 'api/category-amount/update-unique';
    return this.apiService.update(url, data);

}

saveData(data): Observable<any> {
    const url = this.baseRmsConfigurationApiEndPoint + 'api/category-amount/create-unique';
    return this.apiService.post(url, data);

}

saveDatawithfiles(files: any,data): Observable<any> {
  const url = this.baseRmsConfigurationApiEndPoint + 'api/category-amount/create-unique';
  const formData = new FormData();
  files.forEach(res => {
      formData.append('file', res.fileName)
      console.log(res)
  })
  formData.append('body', JSON.stringify(data));
  return this.apiService.post(url, formData);


}


updateDatawithfiles(files: any,deleteList,data): Observable<any> {
  const url = this.baseRmsConfigurationApiEndPoint + 'api/category-amount/update-with-files';
  const formData = new FormData();
  files.forEach(res => {
      formData.append('file', res.fileName)
      console.log(res)
  })
  formData.append('dlist', JSON.stringify(deleteList));
  formData.append('body', JSON.stringify(data));
  return this.apiService.update(url, formData);


}

getListData(page, pageSize): Observable<any> {
    const api = this.baseRmsConfigurationApiEndPoint + 'api/category-amount/pagination/' + page + '/' + pageSize;
    return this.apiService.get(api);
}

delete(rowUuid) {
    const api = this.baseRmsConfigurationApiEndPoint + 'api/category-amount/delete/';
    return this.apiService.delete(api, rowUuid);
}

getAll() {
    const api = this.baseRmsConfigurationApiEndPoint + 'api/fiscal-year/get-list';
    return this.apiService.get(api);
}

getAllActive() {
  const api = this.baseRmsConfigurationApiEndPoint + 'api/fiscal-year/get-active-list';
  return this.apiService.get(api);
}

  }