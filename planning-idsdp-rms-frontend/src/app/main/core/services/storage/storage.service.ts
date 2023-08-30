import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import jwt_decode from "jwt-decode";

@Injectable({
    providedIn: 'root'
})
export class StorageService {
    testBrowser: boolean;
    constructor(
        @Inject(PLATFORM_ID) platformId: string,
        private cookieService: CookieService,
    ) {
        this.testBrowser = isPlatformBrowser(platformId);
    }

    public getAccessToken(): any {
        if (this.testBrowser) {
            //return this.cookieService.get('access_token') ? this.cookieService.get('access_token') : '';
            return sessionStorage.getItem('access_token');
        }
        else
            return;

        /*
        if (this.testBrowser) {
            return sessionStorage.getItem('accessToken');
        }
        else
            return;
        */
    }

    public getDoptorToken(): any {
        if (this.testBrowser) {
            //return this.cookieService.get('doptor_token') ? this.cookieService.get('doptor_token') : '';
            return sessionStorage.getItem('doptor_token'); 
        }
        else
            return;
    }

    public setAccessToken(token): any {
        sessionStorage ? sessionStorage.setItem('accessToken', token) : "";
        return this;
    }

    public getUserData(): any {
        const token = this.getAccessToken();

        if (token) {
            const payload = this.payload(token);           
            const userData = {
                'id': payload.id,
                'name': payload.name,
                'email': payload.userName,
                'userType': payload.userType,
                'isInstitutional': payload.isInstitutional,
                'organigationName':payload.organigationName
            };
            return userData;
        }
        else {
            return null;
        }
    }

    payload(token: string): any {
        try {
            return jwt_decode(token);
        } catch (Error) {
            return null;
        }
    }


    public clear(): any {
        sessionStorage ? sessionStorage.removeItem('accessToken') : '';
    }

    public clearFilterData(): void {
        sessionStorage ? sessionStorage.removeItem('filterData') : '';
    }

}
