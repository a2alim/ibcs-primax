import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from 'environments/environment';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {PmPdSelectionModel} from '../models/pm-pd-selection.model';

@Injectable({
    providedIn: 'root'
})
export class AssetManagementService {

    private baseUrl;

    constructor(private http: HttpClient) {
        this.baseUrl = environment.ibcs.ppsProjectManagementBackendPoint;
    }

    saveAssetManagement(data: any): Observable<any> {
        const url: string = this.baseUrl + 'asset-management/create';
        return this.http.post(url, data);
    }

    getAssetList(page:any , size:any): Observable<any> {
        const url: string = this.baseUrl + 'asset-management/get-list/'+page+'/'+size;
        return this.http.get(url);
    }

    deleteAsset(uuid: any): Observable<any> {
        const url: string = this.baseUrl + 'asset-management/delete/'+uuid;
        return this.http.delete(url);
    }
}
