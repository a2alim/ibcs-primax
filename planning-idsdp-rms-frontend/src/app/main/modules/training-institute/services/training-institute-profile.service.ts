import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {PaginationResponse} from "../models/pagination-response.model";
import {environment} from "../../../../../environments/environment";
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class TrainingInstituteProfileService {

    baseTiEndPoint = environment.ibcs.tiBackend;

    constructor(private http: HttpClient) {
    }

    saveProfileForTrainingInstitute(profile: any):Observable<any> {
        return this.http.post(this.baseTiEndPoint + "training-institute-profile", profile);
    }

    getTrainingInstituteList(): Observable<any>{
        return this.http.get(this.baseTiEndPoint + "training-institute-profile");
    }

    getProfileViewById(id: any) {
        return this.http.get(this.baseTiEndPoint + "training-institute-profile/"+id);

    }


    getTrainingInstituteListPagable(offset,pageSize): Observable<any>{
        return this.http.get(this.baseTiEndPoint + "training-institute-profile/"+offset+"/"+pageSize);
    }

    getProposalByInstituteProfileId(instProfileId: number) {
        return this.http.get(this.baseTiEndPoint + "proposals/get-proposal-by-instPro-id/" + instProfileId);
    }
}
