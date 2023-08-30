import {Injectable} from '@angular/core';
import {environment} from '../../../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {DppTppApiConstant} from '../../constants/dpp-tpp-api.constant';

import {Observable} from 'rxjs';
import { CrudRequestService } from 'app/main/core/services/crud-request.service';
import { AnnexureGoodsAnx } from '../../models/Annexure-goods-anx.model';

@Injectable({
    providedIn: 'root'
})


export class TappAnnexureGoodsService extends CrudRequestService<AnnexureGoodsAnx> {
    constructor(private http: HttpClient, ) {
        super(http, environment.ibcs.ppsRdppRtappBackendPoint + 'tapp-annexure-goods/');
    }


    getDataList(route): Observable<any> {
        const url = this._BASE_URL + route;
        return this.http.get(url);
    }

    getTappMasterData(route): Observable<any> {
        const url = environment.ibcs.ppsDppBackendPoint + 'tapp-annexure-goods/' + route;
        return this.http.get(url);
    }

    deleteRow(rowUuid): Observable<any> {
        const url = this._BASE_URL +"deleteRow/"+ rowUuid;
        return this.http.delete(url);
    }

    //http://localhost:8087/pps-dpp-tapp/tappAnnualPhasingCost/getGrandTotalByProjectConceptId/25
     getTappAnnexure5bData(pcId): Observable<any> {
        const url = environment.ibcs.ppsRdppRtappBackendPoint +"tappAnnualPhasingCost/getGrandTotalByProjectConceptId/"+pcId;
        return this.http.get(url);
    }

}
