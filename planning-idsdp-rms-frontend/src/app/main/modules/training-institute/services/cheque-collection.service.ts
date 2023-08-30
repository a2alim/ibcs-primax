import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {PaginationResponse} from "../models/pagination-response.model";
import {environment} from "../../../../../environments/environment";
import {ChequeCollectionResponse} from '../models/cheque-collection-response.model';
import {ChequeCollectionRequest} from '../models/cheque-collection-request.model';
import {FileUploadModel} from "../../../shared/model/file-upload.model";

@Injectable({
    providedIn: 'root'
})
export class ChequeCollectionService {

    baseTiEndPoint = environment.ibcs.tiBackend;

    constructor(private http: HttpClient) {
    }

    getChequeCollectionList(size: number, page: number, name: string) {
        return this.http.get<PaginationResponse<any[]>>(
            this.baseTiEndPoint + "cheque-collection?pageNo=" + page + "&pageSize=" + size + "&instituteName=" + name);
    }


    getChequeCollection(size: number, page: number) {
        return this.http.get<PaginationResponse<ChequeCollectionResponse[]>>(
            this.baseTiEndPoint + "cheque-collection?pageNo=" + page + "&pageSize=" + size);
    }

    addChequeCollection(ChequeCollectionRequest: ChequeCollectionRequest) {
        return this.http.post(this.baseTiEndPoint + "cheque-collection", ChequeCollectionRequest);
    }

    deleteChequeCollection(chequeId: number) {
        return this.http.delete(this.baseTiEndPoint + "cheque-collection/" + chequeId);
    }

    getChequeCollectionById(chequeId: number) {
        return this.http.get<any>(
            this.baseTiEndPoint + "cheque-collection/" + chequeId);
    }

    editChequeCollection(ChequeCollectionRequest: ChequeCollectionRequest, chequeId: number) {
        return this.http.put(this.baseTiEndPoint + "cheque-collection/" + chequeId, ChequeCollectionRequest);
    }

    uploadSignatureDocument(chequeId: number, fileUpload: FileUploadModel) {
        return this.http.put(this.baseTiEndPoint + "cheque-collection/" + "upload-signatured-document/" + chequeId, fileUpload);
    }
}
