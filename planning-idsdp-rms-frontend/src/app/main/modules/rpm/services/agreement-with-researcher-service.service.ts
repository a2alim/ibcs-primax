import {Injectable} from '@angular/core';

import {environment} from '../../../../../environments/environment';
import {BehaviorSubject, Observable} from 'rxjs';
import {ApiService} from "../../../core/services/api/api.service";

@Injectable({
    providedIn: 'root'
})
export class AgreementWithResearcherServiceService {

    baseApi=environment.ibcs.baseApiEndPoint;

    baseRmsRpmApiEndPoint = environment.ibcs.rpmBackend;
    baseRmsConfigurationApiEndPoint = environment.ibcs.rmsConfigurationBackend;

    agreementResponseData: any = null;

    agreementAllDataResponse: BehaviorSubject<any> = new BehaviorSubject<any>(null);

    constructor(private apiService: ApiService,) {

    }


    getUser() {
        const api = this.baseRmsConfigurationApiEndPoint + 'api/user/all';
        return this.apiService.get(api);
    }

    getUserByType(type) {
        const api = this.baseApi + 'api/users/userType/'+type;
        return this.apiService.get(api);
    }


    saveTabOneData(data): Observable<any> {
        const url = this.baseRmsRpmApiEndPoint + 'api/agreement-with-researcher/create-agreement';
        return this.apiService.post(url, data);

    }

    saveInstallment(data: any): Observable<any> {
        const url = this.baseRmsRpmApiEndPoint + 'api/agreement-installment/create-agreement-installment';
        return this.apiService.post(url, data);
    }

    getAgreementsList(offset: number, pageSize: number): Observable<any> {
        const url = this.baseRmsRpmApiEndPoint + '/api/agreement-with-researcher/get-list/' + offset + '/' + pageSize;
        return this.apiService.get(url);
    }

    saveTabThreeData(agreementJamanatnamaFormModel: any, fileToUpload: any) {
        const url = this.baseRmsRpmApiEndPoint + 'api/agreement-jamanatnama/create-jamanatnama';
        const formData = new FormData();
        fileToUpload.forEach(res => {
            formData.append('file', res)
        })
        formData.append('body', JSON.stringify(agreementJamanatnamaFormModel));
        return this.apiService.post(url, formData);
    }

    saveTabFourData(data: any, file: any) {
        const url = this.baseRmsRpmApiEndPoint + 'api/agreement-party/create-party';
        const formData = new FormData();
        formData.append('file', file)
        formData.append('body', JSON.stringify(data));
        return this.apiService.post(url, formData);
    }


    saveTabFiveData(signatureUploadModelList: any, fileToUpload: any) {
        const url = this.baseRmsRpmApiEndPoint + '/api/agreement-upload/create-files';
        const formData = new FormData();
        fileToUpload.forEach(res => {
            formData.append('file', res)
        })
        formData.append('body', JSON.stringify(signatureUploadModelList));
        return this.apiService.post(url, formData);
    }


    getAllTabData(uuid): Observable<any> {
        const url = this.baseRmsRpmApiEndPoint + 'api/agreement-with-researcher/agreement-all/' + uuid;
        let data = this.apiService.get(url)
        data.subscribe(res => this.agreementAllDataResponse.next(res));
        return data;
    }


    getAllUser(uuid): Observable<any> {
        const url = this.baseRmsConfigurationApiEndPoint + 'api/user/all';
        return this.apiService.get(url);
    }

    getAgreementInfoByProposalId(proposal_id): Observable<any> {
        const url = this.baseRmsRpmApiEndPoint + 'api/agreement-with-researcher/getByResearcherProposalId/'+proposal_id;
        return this.apiService.get(url);
    }

    deleteAgreement(id) {
        const url = this.baseRmsRpmApiEndPoint + '/api/agreement-with-researcher/delete/';
        return this.apiService.delete(url, id);
    }


    updateStatus(data): Observable<any> {
        const url = this.baseRmsRpmApiEndPoint + 'api/agreement-with-researcher/agreement-update-status';
        return this.apiService.update(url, data);
    }


    updateTabOneData(agreementWithResearcherModel: any) {
        const url = this.baseRmsRpmApiEndPoint + 'api/agreement-with-researcher/agreement-update';
        return this.apiService.update(url, agreementWithResearcherModel);
    }

    updateInstallment(data: any) {
        const url = this.baseRmsRpmApiEndPoint + 'api/agreement-installment/agreement-installment-update';
        return this.apiService.update(url, data);
    }

    updateTabThreeData(agreementId:any,agreementJamanatnamaFormModel: any, fileToUpload: any) {
        const url = this.baseRmsRpmApiEndPoint + 'api/agreement-jamanatnama/update-jamanatnama/'+agreementId;
        const formData = new FormData();
        fileToUpload.forEach(res => {
            formData.append('file', res)
        })
        formData.append('body', JSON.stringify(agreementJamanatnamaFormModel));
        return this.apiService.put(url, formData);
    }

    updateTabFourData(agreementId:any,agreementPartyFormModel: any, file: any) {
        const url = this.baseRmsRpmApiEndPoint + 'api/agreement-party/update-party/'+agreementId;
        const formData = new FormData();
        formData.append('file', file)
        formData.append('body', JSON.stringify(agreementPartyFormModel));
        return this.apiService.put(url, formData);
    }
}
