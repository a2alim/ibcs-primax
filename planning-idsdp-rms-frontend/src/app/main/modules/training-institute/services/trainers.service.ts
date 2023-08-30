import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../../../environments/environment";
import { AgreementModel } from '../models/agreement.model';
import { Observable } from "rxjs";
import { TrainersModel } from "../models/trainers.model";

@Injectable({
    providedIn: 'root'
})
export class TrainersService {

    profileId: number;

    baseTiEndPoint = environment.ibcs.tiBackend;

    constructor(private http: HttpClient) {
    }

    getTrainersList(size: number, page: number, proposalId: number): Observable<any> {
        return this.http.get(this.baseTiEndPoint + "trainers/" + size + "/" + page + "/" + proposalId);
    }

    createTrainers(trainerModel: any): Observable<any> {
        return this.http.post(this.baseTiEndPoint + "trainers", trainerModel);
    }

    saveTrainer(trainerModel: any): Observable<any> {
        return this.http.post(this.baseTiEndPoint + "trainers/create", trainerModel);
    }

    updateTrainer(trainerModel: any): Observable<any> {
        return this.http.put(this.baseTiEndPoint + "trainers/update", trainerModel);
    }

    getAllTrainersListBy(uuid: String): Observable<any> {
        return this.http.get(this.baseTiEndPoint + "trainers/trainers/view/" + uuid);
        //return this.http.get(this.baseTiEndPoint + "trainers/" + id);
    }


    deleteTrainer(id) {
        return this.http.delete(this.baseTiEndPoint + "trainers/" + id);
    }

    deleteCourse(id) {
        return this.http.delete(this.baseTiEndPoint + "agreements/" + id);
    }

    getAgreementById(courseId: number) {
        return this.http.get<AgreementModel>(
            this.baseTiEndPoint + "agreements/" + courseId);
    }

    editAgreement(newAgreementModel: AgreementModel, agreementId: number) {
        return this.http.put(this.baseTiEndPoint + "agreements/" + agreementId, newAgreementModel);
    }

    getTrainerById(trainerId: number) {
        return this.http.get<TrainersModel>(this.baseTiEndPoint + "trainers/" + trainerId);
    }

    getByProposalId(proposalId: number) : any{
        return this.http.get<TrainersModel>(this.baseTiEndPoint + "trainers/find-by-proposalId/" + proposalId);
    }

    editTrainer(trainersModel: TrainersModel, trainerId: number) {
        return this.http.put(this.baseTiEndPoint + "trainers/" + trainerId, trainersModel);
    }

    getListData(profileId, page, pageSize): Observable<any> {
        const api = this.baseTiEndPoint + 'api/trainers-list/profile/' + profileId + '/' + page + '/' + pageSize;
        return this.http.get(api);
    }

    delete(rowUuid): Observable<any> {
        const api = this.baseTiEndPoint + 'api/trainers-list/delete/' + rowUuid;
        return this.http.delete(api);
    }

    deleteTrainers(rowUuid): Observable<any> {
        const api = this.baseTiEndPoint + 'trainers/delete/' + rowUuid;
        return this.http.delete(api);
    }


    saveData(value: any): Observable<any> {
        return this.http.post(this.baseTiEndPoint + "api/trainers-list/create", value);
    }

    updateData(value: any): Observable<any> {
        return this.http.put(this.baseTiEndPoint + "api/trainers-list/update", value);
    }

    getTrainerListFindByProfileId(profileId): Observable<any> {
        const api = this.baseTiEndPoint + 'api/trainers-list/profile/' + profileId;
        return this.http.get(api);
    }

    getTrainerListFindByUserId(userId): Observable<any> {
        const api = this.baseTiEndPoint + 'api/trainers-list/profile/by-user-id/' + userId;
        return this.http.get(api);
    }
}
