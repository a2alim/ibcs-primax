import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {map} from 'rxjs/operators';


import {BehaviorSubject} from 'rxjs';
import { environment } from 'environments/environment';
import { AuthService } from 'app/main/modules/auth/services/auth.service';
import { AccessControlUrlConstant } from '../Constant/access-control-url.constant';


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

    constructor(private http: HttpClient, private loginService: AuthService) { }

    /*
    For uploading image
     */
    uploadImage(imageFile: any): any {
        const accessToken = this.loginService.accessToken;
        const header = {
            headers: new HttpHeaders()
                .set('accessToken', accessToken)
        };
        const formData = new FormData();
        formData.append('imageFile', imageFile);

        const uploadImage: string = this.BASE_API_URL + AccessControlUrlConstant.UPLOAD_IMAGE;
        return this.http.post(uploadImage, formData, header).pipe(map((res: any) => {
            return res;
        }));

    }

    /*
    For updating user info
     */
    updateUserProfile(userInfo: any): any {
        const accessToken = this.loginService.accessToken;
        const header = {
            headers: new HttpHeaders()
                .set('accessToken', accessToken)
        };
        const data = {
            profileImageUrl: userInfo.profileImageUrl,
            signatureImageUrl: userInfo.signatureImageUrl,
            presentAddress: userInfo.presentAddress,
            permanentAddress: userInfo.permanentAddress,
            mobileNo: userInfo.mobileNo,
            name: userInfo.name
        };
        const updateProfile: string = this.BASE_API_URL + AccessControlUrlConstant.UPDATE_PROFILE;
        return this.http.put(updateProfile, data, header).pipe(map((res: any) => {
            return res;
        }));
    }


    /*
    For getting user info
     */
    getUserProfileInfo(): any {
        const accessToken = this.loginService.accessToken;
        const header = {
            headers: new HttpHeaders()
                .set('accessToken', accessToken)
        };
        const getUserProfileInfo: string = this.BASE_API_URL + AccessControlUrlConstant.GET_USER_PROFILE_INFO;
        return this.http.get(getUserProfileInfo, header).pipe(map((res: any) => {
            this.dataSource.next(res);
            return res;
        }));
    }
}
