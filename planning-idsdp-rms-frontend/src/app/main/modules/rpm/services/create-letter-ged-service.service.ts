import {Injectable} from '@angular/core';

import {environment} from '../../../../../environments/environment';
import {Observable} from 'rxjs';
import {ApiService} from "../../../core/services/api/api.service";

@Injectable({
  providedIn: 'root'
})
export class CreateLetterGedServiceService {

  data:any;

  fiscalYearList: any[] = [];

  baseRmsRpmApiEndPoint = environment.ibcs.rpmBackend;
  baseRmsConfigurationApiEndPoint = environment.ibcs.rmsConfigurationBackend;
  minioEndPointHost=environment.ibcs.minioEndPointHost;

  constructor(private apiService: ApiService,) {

  }


  getListOfLetter(offset: number,pageSize: number,): Observable<any> {
    const url = this.baseRmsRpmApiEndPoint + 'api/create-letter-ged/get-list/'+offset+'/'+pageSize;
    return this.apiService.get(url);

}


saveData(files: any,data): Observable<any> {
  const url = this.baseRmsRpmApiEndPoint + 'api/create-letter-ged/create-letter';
  const formData = new FormData();
  files.forEach(res => {
      formData.append('file', res.file)
  })
  formData.append('body', JSON.stringify(data));
  return this.apiService.post(url, formData);

}

updateData(data): Observable<any> {
  const url = this.baseRmsRpmApiEndPoint + 'api/create-letter-ged/update';
  return this.apiService.update(url, data);

}

delete(rowUuid) {
  const api = this.baseRmsRpmApiEndPoint + 'api/create-letter-ged/delete/';
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

download(url){
  const api = this.minioEndPointHost + url;
return this.apiService.get(api);
}

}