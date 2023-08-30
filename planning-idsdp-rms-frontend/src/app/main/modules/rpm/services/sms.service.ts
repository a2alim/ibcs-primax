import {Injectable} from '@angular/core';

import {environment} from '../../../../../environments/environment';
import {Observable} from 'rxjs';
import {ApiService} from "../../../core/services/api/api.service";

@Injectable({
    providedIn: 'root'
})
export class SmsService {

    baseRmsRpmApiEndPoint = environment.ibcs.rpmBackend;
    baseRmsConfigurationApiEndPoint = environment.ibcs.rmsConfigurationBackend;


    constructor(private apiService: ApiService,) {

    }

    sendOtp(id): Observable<any> {
        const data = null;
        const url = this.baseRmsRpmApiEndPoint + 'api/sms/send/otp/' + id;
        return this.apiService.post(url, data);

    }


    verifyOtp(data): Observable<any> {
        const url = this.baseRmsRpmApiEndPoint + 'api/sms/profile/otp/verify';
        return this.apiService.post(url, data);

    }

    resendOtp(id): Observable<any> {
        const data = null;
        const url = this.baseRmsRpmApiEndPoint + 'api/sms/profile/otp/resend/' + id;
        return this.apiService.post(url, data);

    }


}
