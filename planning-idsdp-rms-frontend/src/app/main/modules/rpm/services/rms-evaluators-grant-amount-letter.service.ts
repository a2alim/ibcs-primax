import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {CrudRequestService} from 'app/main/core/services/crud-request.service';
import {environment} from 'environments/environment';
import {Observable} from "rxjs";
import {CoreResponse} from "../../../core/models/response";
import {
    GET_BY_PROFILE_UUID,
    GET_BY_RESEARCHER_PROFILE_INFO_ID_GRID_LIST,
    GET_LIST_FIND_BY_STFISCAL_YEAR_ID,
    GET_RESEARCHER_PROPOSAL_DETAILS_BY_UUID,
    RESEARCHER_PROPOSAL
} from "../contants/researcher-proposal.constant";
import {
    GET_BY_FISCAL_YEAR_ID, GET_DETAILS_BY_UUID,
    RMS_EVALUATORS_GRANT_AMOUNT_LETTER, UPLOAD_BY_ID
} from "../contants/evaluators-grant-amount-letter.constant";
import {EvaluatorsGrantAmountLetter} from "../models/EvaluatorsGrantAmountLetter";
import {IPageableRequestBodyDTO} from "../../../core/models/request";
import {map} from "rxjs/operators";
import {ApiService} from "../../../core/services/api/api.service";

@Injectable({
    providedIn: 'root'
})
export class RmsEvaluatorsGrantAmountLetterService extends CrudRequestService {

    baseRmsConfigurationApiEndPoint = environment.ibcs.rpmBackend;

    constructor(private http: HttpClient,
                private apiService: ApiService,) {
        super(http, RMS_EVALUATORS_GRANT_AMOUNT_LETTER);
    }

    getByFiscalYearId(fiscalYearId: number, page: number, size: number): Observable<CoreResponse<EvaluatorsGrantAmountLetter>> {
        const pageableRequestBodyDTO = {page: page, size: size,};
        return this.http.post<CoreResponse<EvaluatorsGrantAmountLetter>>(this._BASE_URL + GET_BY_FISCAL_YEAR_ID, {
            fiscalYearId: fiscalYearId,
            pageable: pageableRequestBodyDTO
        });
    }

    getByUuidWithADetails(uuid: string): Observable<CoreResponse<EvaluatorsGrantAmountLetter>> {
        return this.http.get<CoreResponse<EvaluatorsGrantAmountLetter>>(this._BASE_URL + GET_DETAILS_BY_UUID + "/" + uuid);
    }

    uploadFile(file: File, id: number) {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post<CoreResponse<EvaluatorsGrantAmountLetter>>(this._BASE_URL + UPLOAD_BY_ID + "/" + id, formData);
    }

    downloadFile(url: string) {
        return this.apiService.get(environment.ibcs.minioEndPointHost + url);
    }

}
