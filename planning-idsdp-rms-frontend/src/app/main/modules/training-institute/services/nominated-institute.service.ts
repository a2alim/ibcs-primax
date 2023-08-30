import { Injectable } from '@angular/core';
import { environment } from "../../../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { PaginationResponse } from "../models/pagination-response.model";
import { NominatedInstituteModel } from "../models/nominated-institute.model";
import { Observable } from 'rxjs';
import { CoreResponse } from 'app/main/core/models/response';

@Injectable({
    providedIn: 'root'
})
export class NominatedInstituteService {
    baseTiEndPoint = environment.ibcs.tiBackend;

    constructor(private http: HttpClient) {
    }


    getNominateInstitutes(page: number, size: number, isShortListed: boolean, trainingInstituteId: number, fiscalYearId: number) {

        console.log(isShortListed)
        let requestUrl = this.baseTiEndPoint + 'nominated-institutes?page=' + page + '&size=' + size;

        if (trainingInstituteId) {
            requestUrl += size + '&trainingInstituteId=' + trainingInstituteId;
        }
        if (isShortListed) {
            requestUrl += '&isShortListed=' + isShortListed;
        }
        if (isShortListed === false) {
            requestUrl += '&isShortListed=' + isShortListed;
        }
        if (fiscalYearId) {
            requestUrl += '&fiscalYearId=' + fiscalYearId;
        }

        return this.http.get<PaginationResponse<NominatedInstituteModel[]>>(requestUrl);

        // return this.http.get<PaginationResponse<NominatedInstituteModel[]>>(this.baseTiEndPoint + '/nominated-institutes?page=' + page + '&size=' + size);
    }

    changeShortListStatus(id, checked: boolean) {
        return this.http.put<any>(this.baseTiEndPoint + 'nominated-institutes/change-shortlist-status/'
            + id + "?shortListStatus=" + checked, null);
    }

    changeENothiStatus(id: number, selectValue: string) {
        return this.http.put<any>(this.baseTiEndPoint + 'nominated-institutes/change-status/'
            + id + "?status=" + selectValue, null);
    }

    getProposalGridList(data: any): Observable<any> {
        return this.http.post<CoreResponse<any>>(this.baseTiEndPoint + 'nominated-institutes/grid-list', data);
    }
}
