import { Injectable } from '@angular/core';
import {environment} from '../../../../../environments/environment';
import {CrudRequestService} from '../../../core/services/crud-request.service';
import {DashboardAttachmentModel} from '../models/dashboard-attachment.model';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';


export const dashboard = environment.ibcs.ppsFsBaseEndPoint + 'dashboardAttachment/';

@Injectable({
  providedIn: 'root'
})
export class DashboardAttachmentService extends CrudRequestService<DashboardAttachmentModel> {

    baseUrlDashboardAttachment = 'dashboardAttachment/';

    constructor(private http: HttpClient) {
        super(http, dashboard);
    }

    createDashBoardAttachment(file: File, title: any, fspMasterId: any) {
        const formData = new FormData();
        formData.append('attachmentFile', file);
        formData.append('title', title);
        formData.append('fspMasterId', fspMasterId);

        const uploadDashboardAttachmentDetails: string = environment.ibcs.ppsFsBaseEndPoint + this.baseUrlDashboardAttachment + 'createDashBoardAttachment';
        return this.http.post(uploadDashboardAttachmentDetails, formData).pipe(map((res: any) => {
            return res;
        }));
    }

    getListDashboardAttachment(request, fspMasterId: any): any {
        const url = environment.ibcs.ppsFsBaseEndPoint + this.baseUrlDashboardAttachment + 'getPageableList/' + fspMasterId;
        const params = request;
        return this.http.get(url, {params}).pipe(map((res: any) => {
            return res;
        }));
    }

    updateDashboardAttachment(file: File, title: any, uuid: any, fspMasterId: any) {
        const formData = new FormData();
        formData.append('attachmentFile', file);
        formData.append('title', title);
        formData.append('fspMasterId', fspMasterId);
        const uploadDashboardAttachmentDetails: string = environment.ibcs.ppsFsBaseEndPoint + this.baseUrlDashboardAttachment + 'updateDashBoardAttachment' + '/' + uuid;
        return this.http.put(uploadDashboardAttachmentDetails, formData).pipe(map((res: any) => {
            return res;
        }));
    }
}
