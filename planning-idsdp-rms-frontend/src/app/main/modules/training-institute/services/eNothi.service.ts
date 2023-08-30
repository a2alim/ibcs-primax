import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../../environments/environment";
import {AgreementModel} from '../models/agreement.model';
import {Observable} from "rxjs";
import {TrainersModel} from "../models/trainers.model";
import {ENothiModel} from "../models/e-nothi.model";

@Injectable({
    providedIn: 'root'
})
export class ENothiService {

    baseTiEndPoint = environment.ibcs.tiBackend;

    constructor(private http: HttpClient) {
    }

    getENothis(size: number, page: number, fisId: number): Observable<any> {
        if (fisId)
            return this.http.get(this.baseTiEndPoint + "e-nothi?pageNo=" + page + "&pageSize=" + size + "&fiscalYearId=" + fisId);
        else
            return this.http.get(this.baseTiEndPoint + "e-nothi?pageNo=" + page + "&pageSize=" + size);
    }

    uploadENothi(em: ENothiModel) {
        return this.http.post(this.baseTiEndPoint + "e-nothi", em);
    }
    createTrainers(trainerModel: any): Observable<any> {
        return this.http.post(this.baseTiEndPoint + "trainers", trainerModel);
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

    editTrainer(trainersModel: TrainersModel, trainerId: number) {
        return this.http.put(this.baseTiEndPoint + "trainers/" + trainerId, trainersModel);
    }
}
