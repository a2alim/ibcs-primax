import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { PaginationResponse } from "../models/pagination-response.model";
import { environment } from "../../../../../environments/environment";
import { ParticipantModel } from '../models/participant.model';
import { Observable } from "rxjs";
import { map } from 'rxjs/operators';
import { ApiResponseModel } from "../models/api-response.model";

@Injectable({
    providedIn: 'root'
})
export class ParticipantService {

    baseTiEndPoint = environment.ibcs.tiBackend;

    constructor(private http: HttpClient) {
    }

    getParticipantList(size: number, page: number) {
        return this.http.get<PaginationResponse<ParticipantModel[]>>(
            this.baseTiEndPoint + "participants?pageNo=" + page + "&pageSize=" + size);
    }
    getAllProposalList(uuid): Observable<any> {
        return this.http.get(this.baseTiEndPoint + "participants/participants-view/" + uuid);
    }

    createParticipant(newParticipantModel: ParticipantModel) {
        return this.http.post<ApiResponseModel>(this.baseTiEndPoint + "participants", newParticipantModel);
    }

    deleteParticipant(id) {
        return this.http.delete(this.baseTiEndPoint + "participants/" + id);
    }

    getParticipantById(courseId: number) {
        return this.http.get<any>(
            this.baseTiEndPoint + "participants/" + courseId);
    }

    editParticipant(newParticipantModel: ParticipantModel, participantId: number) {
        return this.http.put(this.baseTiEndPoint + "participants/" + participantId, newParticipantModel);
    }

    public getParticipantViewById(id: any): Observable<any> {
        return this.http.get(this.baseTiEndPoint + "participants/" + "participants-view/" + id).pipe(map(res => res));
    }

    getParticipantsByCourseId(courseId: number) {
        return this.http.get<ParticipantModel[]>(this.baseTiEndPoint + "participants/courses/" + courseId);
    }

    getParticipantsByProposalId(proposalId: number) {
        return this.http.get<ParticipantModel[]>(this.baseTiEndPoint + "participants/find-by-proposalId/" + proposalId);
    }

    changeCompleteStatus(id, checked: boolean) {
        return this.http.put<any>(this.baseTiEndPoint + 'participants/change-complete-status/'
            + id + "?completeStatus=" + checked, null);
    }
}
