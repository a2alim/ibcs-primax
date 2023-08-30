import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {AuthUrlConstant} from './auth-url.constant';

@Injectable({
    providedIn: 'root'
})
export class UaaService {

    constructor(private http: HttpClient) {
    }

    getUserByUserIdAndUserType(userId: any, password: any): any {
        const getUserByUserIdAndUserTypeEndPoint: string = AuthUrlConstant.UAA_USER_BY_USERID_AND_USERTYPE;
        const body = {
            userId: userId,
            userType: 'NOTHI',
            password: password
        };
        return this.http.post(getUserByUserIdAndUserTypeEndPoint, body);
    }

}
