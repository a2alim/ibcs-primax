import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from 'app/main/core/services/api/api.service';
import { CrudRequestService } from 'app/main/core/services/crud-request.service';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { CoreResponse } from "../../../core/models/response";

@Injectable({
    providedIn: 'root'
})
export class FiscalYearWiseDocFilesService extends CrudRequestService {

    baseRmsConfigurationApiEndPoint = environment.ibcs.rpmBackend;

    constructor(
        private http: HttpClient,
        private apiService: ApiService
    ) {

        super(http, `${environment.ibcs.rpmBackend}api/fiscal-year-wise-doc-files/`);
    }


    uploadFile(file: File, stFiscalYearId: number, fileShortDescription: string) {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post<CoreResponse<any>>(this._BASE_URL + "upload-doc-files" + "/" + stFiscalYearId + "/" + fileShortDescription, formData);
    }

    downloadFile(url: string): Observable<any> {
        return this.apiService.get(environment.ibcs.minioEndPointHost + url);
    }

    findAllByStFiscalYearId(stFiscalYearId: number): any {
        return this.http.get(`${this._BASE_URL}find-all-by-stFiscalYearId/${stFiscalYearId}`);
    }

    deleteFile(id: number): any {
        return this.http.post<any>(`${this._BASE_URL}upload-doc-files-delete/${id}`, {});
    }


    previewReport(response, formate) {
        console.log('response ==== >>>> ', response);
        let file = new Blob([response], { type: this.printFormat(formate) });
        var fileURL = URL.createObjectURL(file);
        window.open(fileURL);
    }

    printFormat(formatKey: string) {
        let reportFormatMap = new Map();
        reportFormatMap.set('JPG', 'image/jpg');
        reportFormatMap.set('PNG', 'image/png');
        reportFormatMap.set('JPEG', 'image/jpeg');
        reportFormatMap.set('PDF', 'application/pdf');
        reportFormatMap.set('XLSX', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        reportFormatMap.set('DOCX', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        return reportFormatMap.get(formatKey.toUpperCase());
    }

}
