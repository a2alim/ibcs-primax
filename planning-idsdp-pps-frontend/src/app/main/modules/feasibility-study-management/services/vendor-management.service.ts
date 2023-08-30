import { Injectable } from '@angular/core';
import {CrudRequestService} from '../../../core/services/crud-request.service';
import {VendorManagementModel} from '../models/vendor-management.model';
import {Observable, Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {VENDOR_MANAGEMENT, VENDOR_MANAGEMENT_LIST_BY_FSP_MASTER_ID} from '../constants/vendor-management.constant';
import {IResponseBody} from '../../../core/models/response';

@Injectable({
  providedIn: 'root'
})
export class VendorManagementService extends CrudRequestService<VendorManagementModel> {
    private subject = new Subject<any>();

  constructor(private http: HttpClient) {
      super(http, VENDOR_MANAGEMENT);
  }

    feasibilitySummarySaveClickEvent(){
        this.subject.next();
    }

    // for get Feasibility study proposal summary Save Event
    getFeasibilitySummarySaveEvent():Observable<any>{
        return this.subject.asObservable();
    }

    // for get Vendor Management List By Fs proposal summary
    getVendorManagementListByFsProposalSummary(fspMasterId: number, page?: number, size?: number): Observable<IResponseBody<VendorManagementModel>> {
        const pageableRequestBodyDTO = {
            page: page,
            size: size,
        };
        return this.http.post<IResponseBody<VendorManagementModel>>(this._BASE_URL + VENDOR_MANAGEMENT_LIST_BY_FSP_MASTER_ID, {
            pageableRequestBodyDTO,
            fspMasterId: fspMasterId
        });
    }
}
