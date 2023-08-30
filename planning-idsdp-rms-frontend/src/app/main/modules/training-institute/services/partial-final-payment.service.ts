import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { PaginationResponse } from "../models/pagination-response.model";
import { environment } from "../../../../../environments/environment";
import { PartialFinalPaymentModel, PaymentBillVoucherModel } from '../models/partial-final-payment.model';
import { Observable, Subject } from "rxjs";
import { map } from 'rxjs/operators';
import { ApiResponseModel } from "../models/api-response.model";
import { PreviousPaymentModel } from "../models/previous-payment.model";

@Injectable({
    providedIn: 'root'
})
export class PartialFinalPaymentService {

    baseTiEndPoint = environment.ibcs.tiBackend;

    private partialFinalPaymentModel = new Subject<PartialFinalPaymentModel>();
    private isEditable = new Subject<boolean>();

    public getPartialFinalPaymentModel(): Observable<PartialFinalPaymentModel> {
        return this.partialFinalPaymentModel.asObservable();
    }

    public setPartialFinalPaymentModel(partialFinalPaymentModel: PartialFinalPaymentModel): void {
        this.partialFinalPaymentModel.next(partialFinalPaymentModel);
    }

    public getIsEditable(): Observable<boolean> {
        return this.isEditable.asObservable();
    }

    public setIsEditable(isEditable: boolean): void {
        this.isEditable.next(isEditable);
    }

    constructor(private http: HttpClient) {
    }

    getPartialFinalPaymentList(size: number, page: number) {
        return this.http.get<PaginationResponse<any[]>>(this.baseTiEndPoint + "partial-final-payment?page=" + page + "&size=" + size);
    }

    getList(size: number, page: number, traningInsId: number): any {
        const api = this.baseTiEndPoint + 'partial-final-payment-new/grid-list/' + page + '/' + size + '/' + traningInsId;
        return this.http.get(api);
    }

    getAllPartialFinalPaymentList(uuid): Observable<any> {
        return this.http.get(this.baseTiEndPoint + "participants/participants-view/" + uuid);
    }

    createPartialFinalPayment(newPartialFinalPaymentModel: PartialFinalPaymentModel) {
        return this.http.post<ApiResponseModel>(this.baseTiEndPoint + "partial-final-payment/create", newPartialFinalPaymentModel);
    }

    createPartialFinalPaymentNew(newPartialFinalPaymentModel: PartialFinalPaymentModel): any {
        return this.http.post<ApiResponseModel>(this.baseTiEndPoint + "partial-final-payment-new/create", newPartialFinalPaymentModel);
    }

    updatePartialFinalPaymentNew(newPartialFinalPaymentModel: PartialFinalPaymentModel): any {
        return this.http.put<ApiResponseModel>(this.baseTiEndPoint + "partial-final-payment-new/update", newPartialFinalPaymentModel);
    }

    getBillVoucherByPartialFinalPaymentId(partialFinalPaymentId): any {
        return this.http.get<any>(this.baseTiEndPoint + "payment-bill-voucher-new/find-by-partial-final-payment-id/" + partialFinalPaymentId);
    }

    deletePartialFinalPayment(id) {
        return this.http.delete(this.baseTiEndPoint + "partial-final-payment-new/delete/" + id);
    }

    getPartialFinalPaymentById(id: number) {
        return this.http.get<any>(this.baseTiEndPoint + "partial-final-payment/" + id);
    }

    getPartialFinalPaymentNewById(id: number) {
        return this.http.get<any>(this.baseTiEndPoint + "partial-final-payment-new/" + 'get-by-id/' + id);
    }

    editPartialFinalPayment(newPartialFinalPaymentModel: PartialFinalPaymentModel, participantId: number): any {
        return this.http.put(this.baseTiEndPoint + "partial-final-payment/" + participantId, newPartialFinalPaymentModel);
    }

    public getParticipantViewById(id: any): Observable<any> {
        return this.http.get(this.baseTiEndPoint + "partial-final-payment/" + "participants-view/" + id).pipe(map(res => res));
    }

    getParticipantsByCourseId(courseId: number) {
        return this.http.get<PartialFinalPaymentModel[]>(this.baseTiEndPoint + "participants/courses/" + courseId);
    }

    changeStatus(value: string, id: number) {
        return this.http.put(this.baseTiEndPoint + "/partial-final-payment-new/change-status/" + id + "?status=" + value, null);
    }

    getPreviousPayments(value: number) {
        return this.http.get<PreviousPaymentModel[]>(this.baseTiEndPoint + "partial-final-payment/previous-payments/" + value);
    }

    getPreviousPaymentsNew(value: number): any {
        return this.http.get<PreviousPaymentModel[]>(this.baseTiEndPoint + "partial-final-payment-new/previous-payments/" + value);
    }

    onSaveOrUpdate(PaymentBillVoucherList: PaymentBillVoucherModel[]): any {
        return this.http.post<ApiResponseModel>(this.baseTiEndPoint + "payment-bill-voucher-new/create-list", PaymentBillVoucherList);
    }

    uploadDocument(data: any, attachedFile: File): Observable<any> {
        const formData = new FormData();
        formData.append('data', JSON.stringify(data));
        formData.append('file', attachedFile);
        const url: string = this.baseTiEndPoint + 'payment-bill-voucher-new/upload-doc-files';
        return this.http.post(url, formData).pipe(map((res: any) => res));
    }
}
