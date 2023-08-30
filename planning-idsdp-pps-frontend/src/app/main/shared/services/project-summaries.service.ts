import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {environment} from "../../../../environments/environment";


@Injectable({
    providedIn: 'root'
})
export class ProjectSummariesService{

    constructor(private httpClient: HttpClient) {

    }

    getProjectSummaries(projectUuid : any, summariesType: any) {

        const url: string = environment.ibcs.ppsDppBackendPoint + 'project-summaries/get-summaries/' + projectUuid + '/' + summariesType;
        return this.httpClient.get(url).pipe(map((res: any) => {
            return res;
        }));
    }

    createProjectSummaries(model: any){
        const url: string = environment.ibcs.ppsDppBackendPoint + 'project-summaries/create-summaries';
        return this.httpClient.post(url, model).pipe(map((res: any) => {
            return res;
        }));
    }

    updateProjectSummaries(model, projectId: any, summariesType: string){
        const url: string = environment.ibcs.ppsDppBackendPoint + 'project-summaries/update-summaries' + '/' + projectId+ '/' + summariesType;
        return this.httpClient.put(url, model).pipe(map((res: any) => {
            return res;
        }));
    }

}
