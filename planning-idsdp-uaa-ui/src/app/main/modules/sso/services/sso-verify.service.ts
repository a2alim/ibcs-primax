import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from 'environments/environment';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SsoVerifyService {

    ssoVefifyLink = environment.ibcs.ssoApiEndPoint + 'sso-user-verify';

    constructor(private http: HttpClient) {

    }

    ssoUserVerify(userId, password): Observable<any> {
        const doptorUser = {
            'userId': userId,
            'password': password
        };
        return this.http.post(this.ssoVefifyLink, doptorUser, {observe: 'response'});
    }
}
