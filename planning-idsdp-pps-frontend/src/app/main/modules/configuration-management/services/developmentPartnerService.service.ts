import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {CrudRequestService} from '../../../core/services/crud-request.service';
import {DevelopmentPartnerModel} from '../models/developmentPartnerModel.model';
import {environment} from '../../../../../environments/environment';
import {Observable} from 'rxjs';
import {DELETE_URL} from '../../../core/constants/api';

const httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
    providedIn: 'root'
})
export class DevelopmentPartnerService extends CrudRequestService<DevelopmentPartnerModel> {

    constructor(private http: HttpClient) {
        super(http, environment.ibcs.configurationApiEndPoint + 'developmentPartner/');
    }

    fetchActiveDevelopmentList(): Observable<DevelopmentPartnerModel[]> {
        return this.http.get<DevelopmentPartnerModel[]>( this._BASE_URL + 'fetchActivedevelopmentPartner/');
    }

    getByAllApprovalStatusBy(uuid: string): Observable<DevelopmentPartnerModel[]> {
        return this.http.get<DevelopmentPartnerModel[]>( this._BASE_URL + '/getUUId/' + uuid);
    }

    updateByAllApprovalStatusBy(uuid: string, developmentPartnerName: string, approvalStatusNameBng: string, description: string, status: boolean, code:string): Observable<any> {

        return this.http.put( this._BASE_URL + 'update/getUUId/' + uuid, {

                developmentPartnerName: developmentPartnerName,
                developmentPartnerNameBng: approvalStatusNameBng,
                description: description,
                status: status,
                code: code

            },
        );
    }


    deleteFeature(uuid: string): Observable<{ value: boolean }> {
        return this.http.delete<{ value: boolean }>( this._BASE_URL + DELETE_URL + '/getUUId/' + uuid);
    }

    getModeOfFinance(uuid: string): Observable<DevelopmentPartnerModel[]> {
        return this.http.get<DevelopmentPartnerModel[]>( this._BASE_URL + '/activeModeOfFinance/');
    }
}
