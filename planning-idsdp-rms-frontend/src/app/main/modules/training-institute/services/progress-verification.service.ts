import {Injectable} from '@angular/core';
import {environment} from "../../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {ProgressVerificationRequest} from "../models/progress-verification.request";
import {ProgressVerificationModel} from "../models/progress-verification.model";
import {PaginationResponse} from "../models/pagination-response.model";

@Injectable({
    providedIn: 'root'
})
export class ProgressVerificationService {
    baseTiEndPoint = environment.ibcs.tiBackend;

    constructor(private http: HttpClient) {
    }


    addProgressVerification(progressVerificationModel: ProgressVerificationRequest) {
        return this.http.post(this.baseTiEndPoint + "progress-verification", progressVerificationModel);
    }

    getProgressVerificationList(page: number, size: number) {
        return this.http.get<PaginationResponse<ProgressVerificationModel[]>>(this.baseTiEndPoint + "progress-verification" + "?page=" + page + "&size=" + size);
    }

    getProgressVerificationById(progressVerificationId: number) {
        return this.http.get<ProgressVerificationModel>(this.baseTiEndPoint + "progress-verification/" + progressVerificationId);
    }

    editProgressVerfication(progressVerificationRequest: ProgressVerificationRequest, progressVerificationId: number) {
        return this.http.put(this.baseTiEndPoint + "progress-verification/" + progressVerificationId, progressVerificationRequest);
    }

    deleteProgressVerification(progressVerificationId: number) {
        return this.http.delete(this.baseTiEndPoint + "progress-verification/" + progressVerificationId);
    }
}
