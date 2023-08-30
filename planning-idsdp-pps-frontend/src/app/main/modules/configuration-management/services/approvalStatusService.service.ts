import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {CrudRequestService} from '../../../core/services/crud-request.service';
import {ApprovalStatus} from '../models/approvalStatus.model';
import {environment} from '../../../../../environments/environment';
import {Observable} from 'rxjs';
import {DELETE_URL} from '../../../core/constants/api';

const httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
    providedIn: 'root'
})
export class ApprovalStatusService extends CrudRequestService<ApprovalStatus> {

    constructor(private http: HttpClient) {
        super(http, environment.ibcs.configurationApiEndPoint + 'approval/');
    }

    fetchActiveApprovalStatusList(): Observable<ApprovalStatus[]> {
        return this.http.get<ApprovalStatus[]>( this._BASE_URL + 'fetchActiveApprovalStatus/');
    }

    getByAllApprovalStatusBy(uuid: string): Observable<ApprovalStatus> {
        return this.http.get<ApprovalStatus>( this._BASE_URL + '/getUUId/' + uuid);
    }

    updateByAllApprovalStatusBy(uuid: string, approvalStatusName: string, approvalStatusNameBng: string, description: string, status: boolean): Observable<any> {

        return this.http.put( this._BASE_URL + 'update/getUUId/' + uuid, {

                approvalStatusName: approvalStatusName,
                approvalStatusNameBng: approvalStatusNameBng,
                description: description,
                status: status

            },
        );
    }

    updateApprovalStatus(uuid: string, approvalStatus:ApprovalStatus):Observable<any>{
        return this.http.put( this._BASE_URL + 'update/getUUId/' + uuid, approvalStatus);
    }


    deleteFeature(uuid: string): Observable<{ value: boolean }> {
        return this.http.delete<{ value: boolean }>( this._BASE_URL + DELETE_URL + '/getUUId/' + uuid);
    }

    getAllApprovalStatus() {
        return this.http.get<ApprovalStatus[]>( this._BASE_URL + 'get-all');
    }
}
