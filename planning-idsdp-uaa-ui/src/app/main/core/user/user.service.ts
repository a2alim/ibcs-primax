import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from './user.model';
import { environment } from 'environments/environment';


@Injectable({
    providedIn: 'root'
})
export class UserService {
    private _user: ReplaySubject<User> = new ReplaySubject<User>(1);

    private BASE_API_URL: string = environment.ibcs.baseApiEndPoint;

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for user
     *
     * @param value
     */
    set user(value: User) {
        // Store the value
        this._user.next(value);
    }

    get user$(): Observable<User> {
        return this._user.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Update the user
     *
     * @param user
     */
    update(user: User): Observable<any> {
        return this._httpClient.patch<User>('api/common/user', { user }).pipe(
            map((response) => {
                // Execute the observable
                this._user.next(response);
            })
        );
    }



    public createNewUser(name: any, email: any, mobile: any, password: any, isInstitutional: any): Observable<any> {

        const createNewUserEndPoint: string = `${this.BASE_API_URL}api/rms-researcher-users`;
        const body = {
            'name': name,
            'emailId': email,
            'mobileNumber': mobile,
            'password': password,
            'isInstitutional': isInstitutional
        };
        return this._httpClient.post(createNewUserEndPoint, body);
    }

    public createRmsTINewUser(data: any): Observable<any> {

        const createNewUserEndPoint: string = `${this.BASE_API_URL}api/rms-ti-users`;

        return this._httpClient.post(createNewUserEndPoint, data);
    }

    public UserVerification(data): Observable<any> {
        const createNewUserEndPoint: string = `${this.BASE_API_URL}api/rms-verification/${data}`;
        return this._httpClient.post(createNewUserEndPoint, data);
    }

    public otpVerification(data): Observable<any> {
        const url: string = `${this.BASE_API_URL}api/rms-verification/otp`;
        return this._httpClient.post(url, data);
    }

    public otpResend(data): Observable<any> {
        const url: string = `${this.BASE_API_URL}api/rms-verification/otp/resend//${data}`;
        return this._httpClient.post(url, data);
    }
}
