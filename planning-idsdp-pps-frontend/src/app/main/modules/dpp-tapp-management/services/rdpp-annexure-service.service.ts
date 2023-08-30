import { Injectable } from '@angular/core';
import {CrudRequestService} from "../../../core/services/crud-request.service";
import {AnnexureGoodsAnx} from "../models/Annexure-goods-anx.model";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../../environments/environment";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class RdppAnnexureServiceService extends CrudRequestService<AnnexureGoodsAnx> {

    constructor( private http: HttpClient ) {
        super(http, environment.ibcs.ppsRdppRtappBackendPoint + 'dpp-annexure-goods/');
    }

    getDataList(route): Observable<any> {
        const url = this._BASE_URL + route;
        return this.http.get(url);
    }

    deleteRow(rowId): Observable<any> {
        const url = this._BASE_URL +"deleteRow/"+ rowId;
        return this.http.delete(url);
    }
    getAnnexure5bData(pcId): Observable<any> {
        const url = environment.ibcs.ppsDppBackendPoint +"dppAnnualPhasingCost/getGrandTotalByProjectConceptId/"+pcId;
        return this.http.get(url);
    }

}
