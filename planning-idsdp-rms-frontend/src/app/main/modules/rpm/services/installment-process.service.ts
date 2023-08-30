import {Injectable} from '@angular/core';

import {environment} from '../../../../../environments/environment';
import {Observable} from 'rxjs';
import {ApiService} from "../../../core/services/api/api.service";
import {HttpClient} from "@angular/common/http";


@Injectable({
  providedIn: 'root'
})
export class InstallmentProcessService {

    fiscalYearList: any[] = [];

    processId:number;

    baseRmsRpmApiEndPoint = environment.ibcs.rpmBackend;
    baseRmsConfigurationApiEndPoint = environment.ibcs.rmsConfigurationBackend;
    minioEndPointHost=environment.ibcs.minioEndPointHost;

    constructor(private apiService: ApiService,
                private http: HttpClient,) {

    }


    getProposal(uuid): Observable<any> {
        const url = this.baseRmsRpmApiEndPoint + 'api/installment-process/proposal-uuid/'+uuid;
        return this.apiService.get(url);

    }


    createLetter(data): Observable<any> {
        const url = this.baseRmsRpmApiEndPoint + 'api/installment-process/create-installment-process';
        return this.apiService.post(url,data);

    }

    createBudget(data): Observable<any> {
        const url = this.baseRmsRpmApiEndPoint + 'api/installment-process-expenditure-items/create-list';
        return this.apiService.post(url,data);

    }


    createVoucher(UploadModelList: any, fileToUpload: any,deleteList,modifyFiles): Observable<any> {
        const url = this.baseRmsRpmApiEndPoint + 'api/agreement-installment-files/create-files';
        const formData = new FormData();
        fileToUpload.forEach(res => {
            formData.append('file', res.fileName)
        })
        formData.append('dlist', JSON.stringify(deleteList));
        formData.append('modifyFiles', JSON.stringify(modifyFiles));
        formData.append('body', JSON.stringify(UploadModelList));
        return this.apiService.post(url, formData);

    }

    getInstallmentProcess(offset,pageSize): Observable<any> {
        const url = this.baseRmsRpmApiEndPoint + 'api/installment-process/get-list/'+offset+'/'+pageSize;
        return this.apiService.get(url);

    }


    getInstallmentProcessByUuid(uuid): Observable<any> {
        const url = this.baseRmsRpmApiEndPoint + 'api/installment-process/get-by-uuid/'+uuid;
        return this.apiService.get(url);

    }

    getByProcessId(id): Observable<any> {
        const url = this.baseRmsRpmApiEndPoint + 'api/installment-process-expenditure-items/get-by-process-id/'+id;
        return this.apiService.get(url);

    }


    delete(rowUuid) {
        const api = this.baseRmsRpmApiEndPoint + 'api/installment-process/delete/';
        return this.apiService.delete(api, rowUuid);
    }

    ////////////for upload voucher

   /* get list by process id*/
    getVoucherList(id):Observable<any> {
        const url = this.baseRmsRpmApiEndPoint + 'api/agreement-installment-files/get-by-process-id/'+id;
        return this.apiService.get(url);
    }

    //for View
    getProcesses(uuid):Observable<any> {
        const url = this.baseRmsRpmApiEndPoint + 'api/installment-process/view-by-uuid/'+uuid;
        return this.apiService.get(url);
    }


    updateStatus(row):Observable<any> {
        //console.log(row)
        const url = this.baseRmsRpmApiEndPoint + 'api/installment-process/set-status';
        return this.apiService.post(url,row);

    }
  updateById(id,data):Observable<any> {
        const url = this.baseRmsRpmApiEndPoint + 'api/installment-process/update-by-id/'+id+'/'+data;
        return this.apiService.put(url,id);

    }

    gen():Observable<any> {
        const url ="http://localhost:7777/users-location";
        return this.apiService.get(url);



    }

    getPDF(){
       // const url ="http://localhost:7777/users-location";

        const url = this.baseRmsRpmApiEndPoint + 'test/report';
        const httpOptions = {
            'responseType'  : 'arraybuffer' as 'json'
            //'responseType'  : 'blob' as 'json'        //This also worked
        };
        return this.http.get<any>(url, httpOptions);

    }


}
