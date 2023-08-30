import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../../environments/environment";
import {map} from "rxjs/operators";
import {ProjectMovementStageModel} from "../models/project.movement.model";
import {RdppRtappManagementModule} from "../rdpp-rtapp-management.module";
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ProjectMovementService {

    constructor(private http: HttpClient) {
    }

    forward(projectMovementModel: ProjectMovementStageModel) {
        const url: string = environment.ibcs.ppsRdppRtappBackendPoint + 'project-movement-stage/save-movement';
        return this.http.post(url, projectMovementModel).pipe(map((res: any) => {
            return res;
        }));
    }

    getCurrentStage(id: number, projectType: string) {
        if(projectType.toUpperCase() === 'RDPP') {
            const url: string = environment.ibcs.ppsDppBackendPoint + 'project-movement-stage/get-current-stage-in-rdpp/' + id;
            return this.http.get(url).pipe(map((res: any) => {
                return res;
            }));
        } else {
            const url: string = environment.ibcs.ppsDppBackendPoint + 'project-movement-stage/get-current-stage-in-rtapp/' + id;
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
        const url: string = environment.ibcs.ppsRdppRtappBackendPoint + 'project-movement-stage/get-current-stage-in-pc/' + id;
        return this.http.get(url).pipe(map((res: any) => {
            return res;
        }));
    }

    getCurrentStageInTapp(id: number) {
        const url: string = environment.ibcs.ppsDppBackendPoint + 'project-movement-stage/get-current-stage-in-rtapp/' + id;
        return this.http.get(url).pipe(map((res: any) => {
            return res;
        }));
    }

    getProjectMovementAttachment(projectMovementStageId){
        const url: string = environment.ibcs.ppsRdppRtappBackendPoint + 'project-movement-stage-attachment/attachment/' + projectMovementStageId;
        return this.http.get(url).pipe(map((res: any) => {
            return res;
        }));
    }

    getAllStageByMasterId(source: String, id: number) {
        const url: string = environment.ibcs.ppsRdppRtappBackendPoint + 'project-movement-stage/get-all-stage-by-master-id/' + source + '/' + id;
        return this.http.get(url).pipe(map((res: any) => {
            return res;
        }));
    }

    
    checkUpMovementForDpp(projectMovementStageId): Observable<any>{
        const url: string = environment.ibcs.ppsDppBackendPoint + 'project-movement-stage/check-all-meeting-paper-attachment/'+projectMovementStageId;
        return this.http.get(url);
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
        const url: string = environment.ibcs.ppsDppBackendPoint + 'project-movement-stage-attachment/attachment/get-by-id/' + id + '/' + page + '/' + size;
        return this.http.get(url);
    }

    getAllProjectMovementAttachment(projectMovementId: number): any {
        const url: string = environment.ibcs.ppsDppBackendPoint + 'project-movement-stage-attachment/attachment/get-all-by-id/' + projectMovementId ;
        return this.http.get(url);
    }


}
