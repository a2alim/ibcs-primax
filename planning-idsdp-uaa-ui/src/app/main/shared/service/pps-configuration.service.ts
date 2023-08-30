import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PpsConfigurationService {

    private BASE_API_URL: string = environment.ibcs.baseApiEndPoint;

    constructor(private http: HttpClient) {
    }

    getUserGroupByUserId(): Observable<any> {
        return this.http.get(this.BASE_API_URL + 'pps-configuration/userGroup/getUserGroupByUserId');
    }
}
