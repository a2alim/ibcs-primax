import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from 'environments/environment';
import {Observable} from 'rxjs';
import {HelperService} from '../helper/helper.service';
import {StorageService} from '../storage/storage.service';

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    private baseUrl;
    private apiUrl;
    private authUrl;
    private headers = {};
    private fileHeader = {};

    constructor(
        private http: HttpClient,
        private helper: HelperService,
        private storage: StorageService
    ) {
        this.baseUrl = environment.ibcs.baseApiEndPoint;
        this.apiUrl = environment.ibcs.rmsConfigurationBackend;
        this.authUrl = environment.ibcs.authServerBackendEndpoint;
    }

    getHeader() {
        return {headers: this.helper.getAuthHeader()};
    }

    getHeader2() {
        return {headers: this.helper.getMultipleHeader()};
    }
    public postNothiData(route, data): Observable<any> {
        console.log("data = ", data);
        console.log("route = ", route);
        //return;
            return this.http.post(route, data, this.getHeader2());
    }

    public get(route): Observable<any> {
        //const url = this.apiUrl + route;
        return this.http.get(route, this.getHeader());
    }

    public post(route, data): Observable<any> {
    // const url = this.apiUrl + route;
        return this.http.post(route, data, this.getHeader());
    }

    public put(route, data): Observable<any> {
        return this.http.put(route, data, this.getHeader());
    }

    public saveWithoutToken(route, data): Observable<any> {
        return this.http.post(route, data);
    }

    public update(route, data): Observable<any> {
        //const url = this.apiUrl + route;
        return this.http.put(route, data, this.getHeader());
    }

    public delete(route, id): Observable<any> {
        //const url = this.apiUrl + route + id;
        return this.http.delete(route + id, this.getHeader());
    }

    public getToken(sessionId): Observable<any> {
        return this.http.get(this.authUrl+'get-token-by-session-id/'+sessionId);
    }

}
