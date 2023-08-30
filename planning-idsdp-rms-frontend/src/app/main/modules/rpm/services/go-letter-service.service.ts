import { Injectable } from '@angular/core';

import { environment } from '../../../../../environments/environment';
import { ApiService } from "../../../core/services/api/api.service";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { CrudRequestService } from 'app/main/core/services/crud-request.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class GoLetterServiceService extends CrudRequestService {

    baseEndPoint = environment.ibcs.rpmBackend;

    constructor(private http: HttpClient) {
        super(http, environment.ibcs.rpmBackend + 'api/go-letter/');
    }


    uploadDocument(data: any, attachedFile: File): Observable<any> {
        const formData = new FormData();
        formData.append('data', JSON.stringify(data));
        formData.append('file', attachedFile);
        const url: string = this.baseEndPoint + 'api/go-letter/upload-doc-files';
        return this.http.post(url, formData).pipe(map((res: any) => res));
    }

    findByUuid(uuid: string) {
        let URL = `${this.baseEndPoint}api/go-letter/find-by-uuid/${uuid} `;
        return this.http.get(URL).pipe(map((res: any) => res));
    }









}
