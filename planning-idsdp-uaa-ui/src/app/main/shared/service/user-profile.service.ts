import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {AuthService} from '../../modules/auth/services/auth.service';
import {map} from 'rxjs/operators';

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

    private BASE_API_URL: string = environment.ibcs.baseApiEndPoint;
    private GIS_URL: string = environment.ibcs.gisFrontendApp + 'api/setGISAccesstoken';

    constructor(private http: HttpClient, private authService: AuthService) {
    }

    /* getting user profile info using logged in token */
    getUserProfileInfo(): any {
        const getUserProfileInfo: string = this.BASE_API_URL + 'api/getUserProfileInfo';
        return this.http.get(getUserProfileInfo).pipe(map((res: any) => {
            this.dataSource.next(res);
            return res;
        }));
    }

    setTokenInGis(data: any): Observable<any>{
        return this.http.post(this.GIS_URL, data);
    }
}
