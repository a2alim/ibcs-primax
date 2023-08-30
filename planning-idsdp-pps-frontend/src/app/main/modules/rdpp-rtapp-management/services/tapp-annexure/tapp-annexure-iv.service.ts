import {Injectable} from '@angular/core';
import {environment} from '../../../../../../environments/environment';
import {HttpClient} from '@angular/common/http';

import {Observable} from 'rxjs';
import { AnnexureGoodsAnx } from '../../models/Annexure-goods-anx.model';
import {map} from 'rxjs/operators';
import {CrudRequestService} from "../../../../core/services/crud-request.service";

@Injectable({
    providedIn: 'root'
})

export class TappAnnexureIvService extends CrudRequestService<AnnexureGoodsAnx> {

    constructor(private http: HttpClient, ) {
        super(http, environment.ibcs.ppsRdppRtappBackendPoint + 'tapp-annexure-iv/');
    }

    saveData(route, formData): Observable<any> {
        const url = this._BASE_URL + route;
        return this.http.post(url, formData).pipe(map((res: any) => {
            return res;
        }));
    }

    getData(route): Observable<any> {
        const url = this._BASE_URL + route;        
        return this.http.get(url).pipe(map((res: any) => {
            return res;
        }));
    }

    deleteFile(route): Observable<any> {
        const url = this._BASE_URL + route;        
        return this.http.delete(url).pipe(map((res: any) => {
            return res;
        }));
    }

}
