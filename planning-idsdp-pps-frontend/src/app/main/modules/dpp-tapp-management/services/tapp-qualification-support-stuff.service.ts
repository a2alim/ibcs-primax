import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { CrudRequestService } from 'app/main/core/services/crud-request.service';
import {map} from 'rxjs/operators';
import {TappSupportStuffModel} from '../models/tapp-qualification-support-staff.model';
import { Observable } from 'rxjs';


@Injectable({
    providedIn: 'root'
})

export class TappQualificationSupportStuffService{

    constructor(private http: HttpClient){

    }

    createSupportStuff(staffModel: any,  tappSupportStuffs: any): Observable<any>{
        const data = {
            projectConceptUuid: staffModel.projectConceptUuid,
            projectConceptId: staffModel.projectConceptId,
            gobFund: staffModel.gobFund,
            rpaFund: staffModel.rpaFund,
            dpaFund: staffModel.dpaFund,
            others: staffModel.others,
            status: true,
            tappSupportStuffList: tappSupportStuffs
        }
        const url: string = environment.ibcs.ppsDppBackendPoint + 'qualificationSupportStuff/create234';
        return this.http.post(url, data).pipe(map((res: any) => {
            return res;
        }));
    }

    update(staffModel: any,  tappSupportStuffs: any, pcUuid: any): Observable<any>{
        const data = {
            projectConceptUuid: staffModel.projectConceptUuid,
            projectConceptId: staffModel.projectConceptId,
            gobFund: staffModel.gobFund,
            rpaFund: staffModel.rpaFund,
            dpaFund: staffModel.dpaFund,
            others: staffModel.others,
            status: true,
            tappSupportStuffList: tappSupportStuffs
        }
        const url: string = environment.ibcs.ppsDppBackendPoint + 'qualificationSupportStuff/updateSupportStuff' + '/' + pcUuid;
        return this.http.put(url, data).pipe(map((res: any) => {
            return res;
        }));
    }

    getSupportStuff(pcUuid: string){
        const url: string = environment.ibcs.ppsDppBackendPoint + 'qualificationSupportStuff/getSupportStuff'+ '/' + pcUuid;
        return this.http.get(url).pipe(map((res: any) => {
            return res;
        }));
    }
}
