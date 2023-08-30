import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CrudRequestService} from '../../../core/services/crud-request.service';
import {SubEconomicCodeModel} from '../models/sub-economic-code-model';
import {ApprovalValueSetupModel} from '../models/approval-value-setup-model';
import {environment} from '../../../../../environments/environment';
import { Observable } from 'rxjs';
import { MODULE_LIST } from '../constants/modules.constant';

@Injectable({
    providedIn: 'root'
})
export class ApprovalValueSetupService extends CrudRequestService<ApprovalValueSetupModel> {


    constructor(private http: HttpClient) {
        super(http, environment.ibcs.configurationApiEndPoint + 'approvalValueSetup/');
    }

    getModuleList():Observable<any>{
        return this.http.get(MODULE_LIST);
    }
}
