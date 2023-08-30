import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../../environments/environment";
import {map} from "rxjs/operators";
import {ProjectMovementStageModel} from "../models/project.movement.model";
import {
    DashboardAttachmentDetailsModel
} from "../../project-concept-management/models/dashboard-attachment-details.model";
import {Observable} from "rxjs";
import {RemainingTimeModel} from "../models/remaining-time.model";

@Injectable({
    providedIn: 'root'
})
export class ProjectMovementService {

    constructor(private http: HttpClient) {
    }

    forward(projectMovementModel: ProjectMovementStageModel) {
        const url: string = environment.ibcs.ppsDppBackendPoint + 'project-movement-stage/save-movement';
        return this.http.post(url, projectMovementModel).pipe(map((res: any) => {
            return res;
        }));
    }

    getCurrentStage(id: number, projectType: string) {
        if (projectType.toUpperCase() === 'DPP') {
            const url: string = environment.ibcs.ppsDppBackendPoint + 'project-movement-stage/get-current-stage-in-dpp/' + id;
            return this.http.get(url).pipe(map((res: any) => {
                return res;
            }));
        } else {
            const url: string = environment.ibcs.ppsDppBackendPoint + 'project-movement-stage/get-current-stage-in-tapp/' + id;
            return this.http.get(url).pipe(map((res: any) => {
                return res;
            }));
        }
    }

    getCurrentStageForFsProposal(id: number) {
        const url: string = environment.ibcs.ppsFsBaseEndPoint + 'project-movement-stage/get-current-stage-in-fs/' + id;
        return this.http.get(url).pipe(map((res: any) => {
            return res;
        }));
    }

    getCurrentStageForProjectConcept(id: number) {
        const url: string = environment.ibcs.ppsPcBaseEndPoint + 'project-movement-stage/get-current-stage-in-pc/' + id;
        return this.http.get(url).pipe(map((res: any) => {
            return res;
        }));
    }

    getCurrentStageInPc(id: number) {
        const url: string = environment.ibcs.ppsDppBackendPoint + 'project-movement-stage/get-current-stage-in-pc/' + id;
        return this.http.get(url).pipe(map((res: any) => {
            return res;
        }));
    }

    getCurrentStageInTapp(id: number) {
        const url: string = environment.ibcs.ppsDppBackendPoint + 'project-movement-stage/get-current-stage-in-tapp/' + id;
        return this.http.get(url).pipe(map((res: any) => {
            return res;
        }));
    }

    getProjectMovementAttachment(projectMovementStageId) {
        const url: string = environment.ibcs.ppsDppBackendPoint + 'project-movement-stage-attachment/attachment/' + projectMovementStageId;
        return this.http.get(url).pipe(map((res: any) => {
            return res;
        }));
    }

    getAllStageByMasterId(source: String, id: number) {
        const url: string = environment.ibcs.ppsDppBackendPoint + 'project-movement-stage/get-all-stage-by-master-id/' + source + '/' + id;
        return this.http.get(url).pipe(map((res: any) => {
            return res;
        }));
    }


    saveWorkingPaperWithAttachment(file: File, currentMovementStageId: any, paperType: any): any {
        const formData = new FormData();
        formData.append('attachmentFile', file);
        formData.append('projectMovementStageId', currentMovementStageId);
        formData.append('paperType', paperType);
        const uploadAttachment: string = environment.ibcs.ppsDppBackendPoint + "project-movement-stage/save-psc-attachment";
        return this.http.post(uploadAttachment, formData).pipe(res => {
            return res;
        });
    }

    getProjectMovementAttachmentByDppUuid(id: number, page: number, size: number): any {
        const url: string = environment.ibcs.ppsDppBackendPoint + 'project-movement-stage-attachment/attachment/get-movement-attachment-by-id/' + id + '/' + page + '/' + size;
        return this.http.get(url);
    }

    getAllProjectMovementAttachment(projectMovementId: number): any {
        const url: string = environment.ibcs.ppsDppBackendPoint + 'project-movement-stage-attachment/attachment/get-all-by-id/' + projectMovementId ;
        return this.http.get(url);
    }

    checkUpMovementForDpp(projectMovementStageId,dppMasterId): Observable<any>{
        const url: string = environment.ibcs.ppsDppBackendPoint + 'project-movement-stage/check-all-meeting-paper-attachment/'+projectMovementStageId;
        return this.http.get(url);
    }

    getDppRemainingTimeConditionFMP(model: any): Observable<any> {
        const url: string = environment.ibcs.ppsDppBackendPoint + "project-movement-stage/get_dpp_forward_remaining_time";
        return this.http.post<any>(url, model).pipe(res => {
            return res;
        });
    }


    // getEnothiEcnecReport(): Observable<any>{
    //     const url = environment.ibcs.ppsDppBackendPoint + 'project-movement-stage/'
    //     return this.http.get(url);
    // }

}
