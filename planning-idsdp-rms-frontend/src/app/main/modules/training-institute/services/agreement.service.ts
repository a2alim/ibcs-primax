import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { PaginationResponse } from "../models/pagination-response.model";
import { environment } from "../../../../../environments/environment";
import { AgreementModel } from '../models/agreement.model';
import { Observable, Subject } from 'rxjs';
import { InstallmentModel } from "../models/installment.model";

@Injectable({
    providedIn: 'root'
})
export class AgreementService {

    baseTiEndPoint = environment.ibcs.tiBackend;

    private agreementModel = new Subject<AgreementModel>();
    private installments = new Subject<InstallmentModel[]>();

    public getInstallments(): Observable<InstallmentModel[]> {
        return this.installments.asObservable();
    }

    public setInstallments(installments: InstallmentModel[]) {
        this.installments.next(installments);
    }

    public getAgreementModel(): Observable<AgreementModel> {
        return this.agreementModel.asObservable();
    }

    public setAgreementModel(agreementModel: AgreementModel): void {
        this.agreementModel.next(agreementModel);
    }

    constructor(private http: HttpClient) {
    }

    getAgreementList(size: number, page: number) {
        return this.http.get<PaginationResponse<any>>(
            this.baseTiEndPoint + "agreements?pageNo=" + page + "&pageSize=" + size);
    }

    getAllAgreementViewList(agreementId): Observable<any> {
        return this.http.get(this.baseTiEndPoint + "agreements/view-listData/" + agreementId);
    }

    createAgreement(newAgreementModel: AgreementModel) {
        return this.http.post(this.baseTiEndPoint + "agreements", newAgreementModel);
    }

    deleteCourse(id) {
        return this.http.delete(this.baseTiEndPoint + "agreements/" + id);
    }

    getAgreementById(courseId: number) {
        return this.http.get<any>(
            this.baseTiEndPoint + "agreements/" + courseId);
    }

    editAgreement(newAgreementModel: AgreementModel, agreementId: number) {
        return this.http.put(this.baseTiEndPoint + "agreements/" + agreementId, newAgreementModel);
    }

    changeStatus(value: string, agreementId: number) {
        return this.http.put(this.baseTiEndPoint +
            "agreements/change-status/" + agreementId + "?agreementStatus=" + value, null);
    }

    getAgreementByProposalId(id: number) {
        return this.http.get<AgreementModel>(
            this.baseTiEndPoint + "agreements/proposal/" + id);
    }

    getInstallmentsByProposalId(proposalId: number) {
        return this.http.get<InstallmentModel[]>(
            this.baseTiEndPoint + "agreements/installments/" + proposalId);
    }

    getProposalByTiUser(): any {
        return this.http.get<AgreementModel>(this.baseTiEndPoint + "agreements/find-proposal-by-ti-user-id");
    }

}
