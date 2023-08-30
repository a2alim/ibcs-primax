import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, of, throwError} from 'rxjs';
import {catchError, map, switchMap} from 'rxjs/operators';
import {AuthUtils} from '../../../core/auth/auth.utils';
import {UserService} from '../../../core/user/user.service';
import {environment} from 'environments/environment';
import {AuthUrlConstant} from './auth-url.constant';
import {CookieService} from 'ngx-cookie-service';
import jwt_decode from 'jwt-decode';
import {StorageService} from "../../../core/services/storage/storage.service";

@Injectable()
export class AuthService {
    uaaServiceUrl = environment.ibcs.baseApiEndPoint;
    private _authenticated: boolean = false;

    tokenInfo = sessionStorage.getItem('access_token');

    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient,
        private _userService: UserService,
        private cookieService: CookieService,
        private storage: StorageService,
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for access token
     */
    set accessToken(token: string) {
        //this.cookieService.set('access_token', token);
    }

    get accessToken(): string {
        //return this.cookieService.get('access_token') ? this.cookieService.get('access_token') : '';
       // return this.tokenInfo ? this.tokenInfo : "";
       return this.storage.getAccessToken();
    }

    checkAcessToken(): boolean {
        //return this.cookieService.check('access_token');
        return this.tokenInfo ? true : false;
    }

    getLoggedUserDetails(): any {
        //let tokenInfo = this.getDecodedAccessToken(this.cookieService.get('access_token')); // decode token
        let tokenInfo = this.getDecodedAccessToken(sessionStorage.getItem('access_token'));
        return tokenInfo;
    }

    getLoggedUserName(): string {
       // let tokenInfo = this.getDecodedAccessToken(this.cookieService.get('access_token')); // decode token
        let tokenInfo = this.getDecodedAccessToken(sessionStorage.getItem('access_token')); // decode token
        //let tokenInfo = this.tokenDecodedAccess;
        return tokenInfo.user_name;
    }

    getLoggedUserId(): number {
        let tokenInfo = this.getDecodedAccessToken(sessionStorage.getItem('access_token')); // decode token
        return tokenInfo.id;
    }

    getLoggedUserType(): any {
        let tokenInfo = this.getDecodedAccessToken(sessionStorage.getItem('access_token')); // decode token
        return tokenInfo.userType;
    }

    /*
    * {
    "id": 74,
    "userId": "3160ec7bec4aaff0101d6b6313223da32564e76a6d56bcfe74fc607b20884f0a",
    "organigationName": "AR TI",
    "name": "Moniruzzaman Rony",
    "emailId": "ti@gmail.com",
    "dateOfBirth": null,
    "designation": "Senior Programmer",
    "mobileNumber": "01788841890",
    "tfa_Enabled": null,
    "isActive": true,
    "isDelete": false,
    "userType": "Rms_Training_Institute",
    "userGroupId": null,
    "dutyType": null,
    "roles": null,
    "dutyTypeId": null
}
    * */
    getLoggedUserDetailsById(): Observable<any> {
        return this._httpClient.get(this.uaaServiceUrl + 'api/users/' + this.getLoggedUserId());
    }

    getUserDetailsById(id: number): Observable<any> {
        return this._httpClient.get(this.uaaServiceUrl + 'api/users/' + id);
    }

    getAllUser(): Observable<any> {
        return this._httpClient.get(this.uaaServiceUrl + 'api/users/all');
    }

    getUserByType(type) {
        return this._httpClient.get(this.uaaServiceUrl + 'api/users/userType/'+type);
    }

    getDecodedAccessToken(token: string): any {
        try {
            return jwt_decode(token);
        } catch (Error) {
            return null;
        }
    }

    tokenDecodedAccess(): any {
        try {
            return jwt_decode(sessionStorage.getItem('access_token'));
        } catch (Error) {
            return null;
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Forgot password
     *
     * @param email
     */
    forgotPassword(email: string): Observable<any> {
        //return this._httpClient.post('api/auth/forgot-password', email);
        const header = {
            headers: new HttpHeaders()
                .set('skip', 'true')
        };
        return this._httpClient.put(AuthUrlConstant.FORGET_PASSWORD_ENDPOINT + '/' + email, null, header).pipe(map((res: any) => {
            return res;
        }));
    }

    /**
     * Reset password
     *
     * @param password
     */
    resetPassword(password: string): Observable<any> {
        return this._httpClient.post('api/auth/reset-password', password);
    }

    /**
     * Sign in
     *
     * @param credentials
     */
    signIn(credentials: { username: string, password: string }): Observable<any> {
        // Throw error, if the user is already logged in
        if (this._authenticated) {
            return throwError('User is already logged in.');
        }

        return this._httpClient.post('api/auth/sign-in', credentials).pipe(
            switchMap((response: any) => {

                // Store the access token in the local storage
                this.accessToken = response.access_token;

                // Set the authenticated flag to true
                this._authenticated = true;

                // Store the user on the user service
                this._userService.user = response.user;

                // Return a new observable with the response
                return of(response);
            })
        );
    }

    public login(username: any, password: any): Observable<any> {
        const header = {
            headers: new HttpHeaders()
                .set('skip', 'true')
                .set('Access-Control-Allow-Origin', '*')
                .set('Basic-Auth', 'True')
                .set('cache-control', 'no-cache')
                .set('Authorization', 'Basic ' + btoa(environment.clientid + ':' + environment.clientSecret))
                .set('Content-Type', 'application/x-www-form-urlencoded')

        };

        const params = new URLSearchParams();
        params.append('grant_type', 'password');
        params.append('username', username);
        params.append('password', password);
        return this._httpClient.post(AuthUrlConstant.OAUTH_ENDPOINT, params.toString(), header).pipe(
            switchMap((response: any) => {
                // Store the access token in the local storage
                this.accessToken = response.access_token;

                // Set the authenticated flag to true
                this._authenticated = true;

                // Store the user on the user service
                const user = {
                    id: null,
                    name: username,
                    email: username,
                    avatar: null,
                    status: 'online'
                }
                this._userService.user = user;

                // Return a new observable with the response
                return of(response);
            })
        );
    }

    /**
     * Sign in using the access token
     */
    signInUsingToken(): Observable<any> {
        // Renew token
        return this._httpClient.post('api/auth/refresh-access-token', {
            access_token: this.accessToken
        }).pipe(
            catchError(() => {

                // Return false
                return of(false);
            }),
            switchMap((response: any) => {

                // Store the access token in the local storage
                this.accessToken = response.access_token;

                // Set the authenticated flag to true
                this._authenticated = true;

                // Store the user on the user service
                this._userService.user = response.user;

                // Return true
                return of(true);
            })
        );
    }

    /**
     * Sign out
     */
    signOut(): Observable<any> {
        // Remove the access token from the local storage
        sessionStorage.removeItem('access_token');
        sessionStorage.removeItem('sessionId');
        sessionStorage.removeItem('doptor_token');
        sessionStorage.removeItem('enMenu');
        sessionStorage.removeItem('bnMenu');

        // Set the authenticated flag to false
        this._authenticated = false;

        // Return the observable
        return of(true);
    }

    /**
     * Sign up
     *
     * @param user
     */
    signUp(user: { name: string, email: string, password: string, company: string }): Observable<any> {
        return this._httpClient.post('api/auth/sign-up', user);
    }

    /**
     * Unlock session
     *
     * @param credentials
     */
    unlockSession(credentials: { email: string, password: string }): Observable<any> {
        return this._httpClient.post('api/auth/unlock-session', credentials);
    }

    /**
     * Check the authentication status
     */
    check(): Observable<boolean> {
        // Check if the user is logged in
        if (this._authenticated) {
            return of(true);
        }

        // Check the access token availability
        if (!this.checkAcessToken) {
            return of(false);
        }

        // Check the access token expire date
        if (AuthUtils.isTokenExpired(this.accessToken)) {
            return of(false);
        }

        // If the access token exists and it didn't expire, sign in using it
        return this.signInUsingToken();
    }
}
