import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {AuthUrlConstant} from './auth-url.constant';
import {user} from '../../../../mock-api/common/user/data';

@Injectable({
    providedIn: 'root'
})
export class SsoService {

    constructor(private http: HttpClient) {
    }

    ssoRedirectLink: string = 'http://localhost:8087/sso';

    getRedirectionLink(): Observable<any> {
        return this.http.get(this.ssoRedirectLink, {responseType: 'text'});
    }

    signInWithDoptor(userId: any, password: any): Observable<any> {
        const header = {
            headers: new HttpHeaders()
                .set('skip', 'true')
                .set('Access-Control-Allow-Origin', '*')
                .set('Basic-Auth', 'True')
                .set('cache-control', 'no-cache')


        };
        const doptorUser = {
            'userId': userId,
            'password': password
        };
        return this.http.post(AuthUrlConstant.OAUTH_SSO_ENDPOINT, doptorUser, header);
    }

}
