import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { CrudRequestService } from 'app/main/core/services/crud-request.service';
import { DppProjectManagementModel } from '../models/dppProjectManagement.model';
import {map} from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})



export class DppProjectManagementSetupService extends CrudRequestService<DppProjectManagementModel> {

    constructor(private http: HttpClient) {
        super(http, environment.ibcs.ppsDppBackendPoint + 'projectManagementSetup/');


    }



    createProjectSetup(data): Observable<any> {
        // const data = {
        //     existingSetup: existingSetup,
        //     executionSetup: executionSetup,
        //     outSourcing: outSourcing,

        // };
        console.log(data);
        const url: string = environment.ibcs.ppsDppBackendPoint + 'projectManagementSetup/create-project-setup';
        return this.http.post(url, data).pipe(map((res: any) => {
            return res;
        }));
    }

    getProjectManagementSetup(porjectId: any): Observable<any> {
        console.log(porjectId);
        const url: string = environment.ibcs.ppsDppBackendPoint + 'projectManagementSetup/getProjectManagementSetup' + '/' + porjectId;
        return this.http.get(url).pipe(map((res: any) => {
            return res;
        }));
    }

    deleteProjectSetup(uuid: any){
        const url: string = environment.ibcs.ppsDppBackendPoint + 'projectManagementSetup/delete' + '/' + uuid;
        return this.http.delete(url).pipe(map((res: any) => {
            console.log('res=========', res);
            return res;
        }));
    }

    deleteRow(uuid): Observable<any> {
        const url: string = environment.ibcs.ppsDppBackendPoint + 'projectManagementSetup/deleteRow' + '/' + uuid;
        return this.http.delete(url);
    }

    updateprojectManagementSetup(data){
        const url: string = environment.ibcs.ppsDppBackendPoint + 'projectManagementSetup/update';
        return this.http.put(url, data).pipe(map((res: any) => {
            return res;
        }));
    }

    getProjectMannagementOrganogramAttachment(porjectId: any): Observable<any> {
        const url: string = environment.ibcs.ppsDppBackendPoint + 'projectManagementSetup/getProjectMannagementOrganogramAttachment' + '/' + porjectId;
        return this.http.get(url).pipe(map((res: any) => {
            return res;
        }));
    }

}
