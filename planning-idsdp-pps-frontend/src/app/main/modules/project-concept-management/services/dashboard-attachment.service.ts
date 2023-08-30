import {Injectable} from '@angular/core';
import {environment} from '../../../../../environments/environment';
import {map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {CrudRequestService} from '../../../core/services/crud-request.service';
import {DashboardAttachmentModel} from '../models/dashboard-attachment.model';
import {DashboardAttachmentDetailsModel} from "../models/dashboard-attachment-details.model";
import {Observable} from "rxjs";
import {DELETE_BY_ID} from "../../../core/constants/api";

export const dashboard = environment.ibcs.ppsPcBaseEndPoint + 'dashboardAttachment/';

@Injectable({
    providedIn: 'root'
})
export class DashboardAttachmentService extends CrudRequestService<DashboardAttachmentModel> {

    baseUrlDashboardAttachment = 'dashboardAttachment/';

    constructor(private http: HttpClient) {
        super(http, dashboard);
    }

    createDashBoardAttachment(file: File, title: any, projectSummaryId: any, projectType: string) {
        const formData = new FormData();
        formData.append('attachmentFile', file);
        formData.append('title', title);
        formData.append('projectSummaryId', projectSummaryId);
        formData.append('projectType', projectType);

        const uploadDashboardAttachmentDetails: string = environment.ibcs.ppsPcBaseEndPoint + this.baseUrlDashboardAttachment + 'createDashBoardAttachment';
        return this.http.post(uploadDashboardAttachmentDetails, formData).pipe(map((res: any) => {
            return res;
        }));
    }

    createRdppRtappDashBoardAttachment(file: File, title: any, rdppRtappMasterId: any, projectType: string) {
        const formData = new FormData();
        formData.append('attachmentFile', file);
        formData.append('title', title);
        formData.append('rdppRtappMasterId', rdppRtappMasterId);
        formData.append('projectType', projectType);

        const uploadDashboardAttachmentDetails: string = environment.ibcs.ppsPcBaseEndPoint + this.baseUrlDashboardAttachment + 'createRdppRtappDashBoardAttachment';
        return this.http.post(uploadDashboardAttachmentDetails, formData).pipe(map((res: any) => {
            return res;
        }));
    }

    getRdppRtappListDashboardAttachment(request, rdppRtappMasterId: any, projectType: string): any {
        const url = environment.ibcs.ppsPcBaseEndPoint + this.baseUrlDashboardAttachment + 'getRdppRtappPageableList/' + rdppRtappMasterId +'/' + projectType;
        const params = request;
        return this.http.get(url, {params}).pipe(map((res: any) => {
            return res;
        }));
    }

    getListDashboardAttachment(request, projectConceptMasterId: any, projectType: string): any {
        const url = environment.ibcs.ppsPcBaseEndPoint + this.baseUrlDashboardAttachment + 'getPageableList/' + projectConceptMasterId +'/' + projectType;
        const params = request;
        return this.http.get(url, {params}).pipe(map((res: any) => {
            return res;
        }));
    }

    getByPcIdAndProjectType(projectConceptMasterId: any, projectType: string): Observable<DashboardAttachmentDetailsModel[]> {
        const url = environment.ibcs.ppsPcBaseEndPoint + this.baseUrlDashboardAttachment + 'getByPcIdAndProjectType/' + projectConceptMasterId +'/' + projectType;
        return this.http.get<DashboardAttachmentDetailsModel[]>(url).pipe(map((res: any) => {
            return res;
        }));
    }

    updateDashboardAttachment(file: File, title: any, uuid: any, projectSummaryId: any, projectType: string) {
        const formData = new FormData();
        formData.append('attachmentFile', file);
        formData.append('title', title);
        formData.append('projectSummaryId', projectSummaryId);
        formData.append('projectType', projectType);
        const uploadDashboardAttachmentDetails: string = environment.ibcs.ppsPcBaseEndPoint + this.baseUrlDashboardAttachment + 'updateDashBoardAttachment' + '/' + uuid;
        return this.http.put(uploadDashboardAttachmentDetails, formData).pipe(map((res: any) => {
            return res;
        }));
    }

    updateRdppRtappDashboardAttachment(file: File, title: any, uuid: any, rdppRtappMasterId: any, projectType: string) {
        const formData = new FormData();
        formData.append('attachmentFile', file);
        formData.append('title', title);
        formData.append('rdppRtappMasterId', rdppRtappMasterId);
        formData.append('projectType', projectType);
        const uploadDashboardAttachmentDetails: string = environment.ibcs.ppsPcBaseEndPoint + this.baseUrlDashboardAttachment + 'updateRdppRtappDashBoardAttachment' + '/' + uuid;
        return this.http.put(uploadDashboardAttachmentDetails, formData).pipe(map((res: any) => {
            return res;
        }));
    }

    getOtherAttachmentForPartB(request, projectConceptMasterId: any): any {
        const url = environment.ibcs.ppsDppBackendPoint + 'dpp-dashboard/part-b-attachment/' + projectConceptMasterId;
        const params = request;
        return this.http.get(url, {params}).pipe(map((res: any) => {
            return res;
        }));
    }

    getOtherAttachmentForPartBWithoutPageable(projectConceptMasterId: any): Observable<DashboardAttachmentDetailsModel[]> {
        const url = environment.ibcs.ppsDppBackendPoint + 'dpp-dashboard/part-b-attachment-without-pageable/' + projectConceptMasterId;
        return this.http.get<DashboardAttachmentDetailsModel[]>(url).pipe(map((res: any) => {
            return res;
        }));
    }

    deleteDashboardAttachmentById(id: number) {
        return this.http.delete<any>(environment.ibcs.ppsPcBaseEndPoint + this.baseUrlDashboardAttachment + DELETE_BY_ID + '/' + id);
    }
}
