import {Injectable} from '@angular/core';
import {environment} from '../../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {RdppRtappManagementModule} from "../rdpp-rtapp-management.module";

@Injectable({
    providedIn: 'root'
})
export class DppTappService {

    private BASE_API_URL: string = environment.ibcs.configurationApiEndPoint;

    constructor(private http: HttpClient) {
    }

}
