import {Injectable} from '@angular/core';
import {environment} from '../../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {DppTppApiConstant} from '../constants/dpp-tpp-api.constant';

import {Observable} from 'rxjs';
import { CrudRequestService } from 'app/main/core/services/crud-request.service';
import { AnnexureGoodsAnx } from '../models/Annexure-goods-anx.model';

@Injectable({
    providedIn: 'root'
})

export class RDppAnnexureThreeService extends CrudRequestService<AnnexureGoodsAnx> {

    constructor( private http: HttpClient ) {
        super(http, environment.ibcs.ppsDppBackendPoint + 'dpp-annexure-goods/');
    }

    getDataList(route): Observable<any> {
        const url = this._BASE_URL + route;
        return this.http.get(url);
    }

    deleteRow(rowId): Observable<any> {
        const url = this._BASE_URL +"deleteRow/"+ rowId;
        return this.http.delete(url);
    }

    getAnnexure5bData(rdppMasterId): Observable<any> {
        const url = environment.ibcs.ppsRdppRtappBackendPoint +"rdppAnnualPhasingCost/getGrandTotalByProjectConceptId/"+rdppMasterId;
        return this.http.get(url);
    }

}
