import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {map} from 'rxjs/operators';

import {environment} from '../../../../../environments/environment';
import {BehaviorSubject, Observable} from 'rxjs';
import { AuthService } from '../../auth/services/auth.service';

export class UserProfileModel {
    name: any;
    profileImageUrl: any;
    signatureImageUrl: any;
}

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {

    dataSource = new BehaviorSubject<any>(new UserProfileModel());
    currentData = this.dataSource.asObservable();

    private BASE_API_URL: string = environment.ibcs.authServerBackendEndpoint;

    constructor(private http: HttpClient, private loginService: AuthService) { }


    getUserProfileInfo(): any {
        const getUserProfileInfo: string = this.BASE_API_URL + 'getUserProfileInfo';
        return this.http.get(getUserProfileInfo).pipe(map((res: any) => {
            this.dataSource.next(res);
            return res;
        }));
    }

    getUserById(id): Observable<any>{
        const getUserInfo: string = this.BASE_API_URL + 'users/' + id;
        return this.http.get(getUserInfo);
    }
}
