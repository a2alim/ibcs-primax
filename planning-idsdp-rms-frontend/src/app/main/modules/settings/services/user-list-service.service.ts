import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {environment} from '../../../../../environments/environment';
import {ApiService} from "../../../core/services/api/api.service";

@Injectable({
    providedIn: 'root'
})
export class UserListServiceService {

    baseRmsConfigurationApiEndPoint = environment.ibcs.rmsConfigurationBackend;
    baseApi=environment.ibcs.baseApiEndPoint;

    constructor(private http: HttpClient, private apiService: ApiService,) {
    }

    getAllUser() {
        const api = this.baseRmsConfigurationApiEndPoint + 'api/user/all';
        return this.apiService.get(api);
    }

    getUserByType(type) {
        const api = this.baseApi + 'api/users/userType/'+type;
        return this.apiService.get(api);
    }

    public createNewUser(name: any, email: any, mobile: any, password: any, isInstitutional: any){

        const createNewUserEndPoint: string = `${this.baseApi}api/rms-evaluator-users`;
        const body = {
            'name': name,
            'emailId': email,
            'mobileNumber': mobile,
            'password': password,
            'isInstitutional': isInstitutional
        };
        return this.apiService.post(createNewUserEndPoint, body);
    }

    getUserById(userId) {
        const api = this.baseApi + 'api/users/'+userId;
        return this.apiService.get(api);
    }


}
