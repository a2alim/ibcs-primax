import {Injectable} from '@angular/core';
import {environment} from '../../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {DashboardConstant} from '../constants/dashboard.constant';
import {BaseUrlConstant} from '../../../core/constants/base.url.constant';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ProjectConceptService {

    public projectSummaryCreateId: number = 0;
    public projectSummaryCreateUuid: string;
    private BASE_API_URL: string = environment.ibcs.ppsPcBaseEndPoint;

    constructor(private http: HttpClient) {
    }

    getUserById(userId: any): any {
        const getUserByIdEndPoint: string = this.BASE_API_URL + DashboardConstant.USER_ENDPOINT + BaseUrlConstant.SLASH + userId;
        return this.http.get(getUserByIdEndPoint);
    }

    getUserByUserId(userId: any): any {
        const getUserByUserIdEndPoint: string = this.BASE_API_URL + DashboardConstant.USERS_BY_USER_ID_ENDPOINT + BaseUrlConstant.SLASH + userId;
        return this.http.get(getUserByUserIdEndPoint);
    }

    verifyUser(userId: any, password: any): Observable<any> {
        const verifyUserEndPoint: string = this.BASE_API_URL + DashboardConstant.USER_VERIFY_ENDPOINT + BaseUrlConstant.SLASH + userId;
        const body = {
            'password': password
        };
        return this.http.put(verifyUserEndPoint, body);
    }
}
