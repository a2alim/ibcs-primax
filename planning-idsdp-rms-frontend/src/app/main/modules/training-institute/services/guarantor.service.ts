import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {PaginationResponse} from "../models/pagination-response.model";
import {GuarantorResponse} from "../models/guarantor-response.model"
import {GuarantorRequest, UploadFile} from "../models/guarantor-request.model"
import {environment} from "../../../../../environments/environment";
import {FileUploadModel} from "../../../shared/model/file-upload.model";
@Injectable({
  providedIn: 'root'
})
export class GuarantorService {

    baseTiEndPoint = environment.ibcs.tiBackend;

    constructor(private http: HttpClient) {
    }

    uploadFile(em: UploadFile, guarantorId: number) {
        return this.http.put(this.baseTiEndPoint + "guarantor-agreement/file-upload/"+ guarantorId, em);
    }

    getGuarantorList(size: number, page: number, name: string) {
        return this.http.get<PaginationResponse<any[]>>(
            this.baseTiEndPoint + "guarantor-agreement?pageNo=" + page + "&pageSize=" + size + "&guarantorName=" + name);
    }


    getGuarantors(size: number, page: number) {
        return this.http.get<PaginationResponse<GuarantorResponse[]>>(
            this.baseTiEndPoint + "guarantor-agreement?pageNo=" + page + "&pageSize=" + size);
    }

    addGuarantor(guarantorRequest: GuarantorRequest) {
        return this.http.post(this.baseTiEndPoint + "guarantor-agreement", guarantorRequest);
    }

    deleteGuarantor(guarantorId: number) {
        return this.http.delete(this.baseTiEndPoint + "guarantor-agreement/" + guarantorId);
    }

    getGuarantorById(guarantorId: number) {
        return this.http.get<any>(
            this.baseTiEndPoint + "guarantor-agreement/" + guarantorId);
    }

    editGuarantor(guarantorRequest: GuarantorRequest, guarantorId: number) {
        return this.http.put(this.baseTiEndPoint + "guarantor-agreement/" + guarantorId, guarantorRequest);
    }

    getGuarantorByProposalId(id: number) {
        return this.http.get<GuarantorResponse>(
            this.baseTiEndPoint + "guarantor-agreement/proposal/" + id);
    }
}
