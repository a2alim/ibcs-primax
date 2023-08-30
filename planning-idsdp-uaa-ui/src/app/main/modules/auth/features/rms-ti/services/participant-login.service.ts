import {Injectable} from '@angular/core';


import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ParticipantLoginService {

    tiBackendRootUrl = environment.ibcs.tiBackendRootUrl;


    constructor(private _httpClient: HttpClient) {

    }

    sendOTPCode(body: any): Observable<any> {
        const api = this.tiBackendRootUrl + 'public/participants/otp/send';
        console.log(body);
        return this._httpClient.post(api, body);
    }

    login(body: any): Observable<any> {
        const api = this.tiBackendRootUrl + 'public/participants/login';
        return this._httpClient.post(api, body);
    }

}
