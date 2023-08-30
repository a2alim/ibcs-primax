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
export class TiGoLetterServiceService extends CrudRequestService {

    baseEndPoint = environment.ibcs.tiBackend;

    constructor(private http: HttpClient) {
        super(http, environment.ibcs.tiBackend + 'create-go-letter/');
    }

    findByUuid(uuid: string) {
        let URL = `${this.baseEndPoint}create-go-letter/find-by-uuid/${uuid} `;
        return this.http.get(URL).pipe(map((res: any) => res));
    }









}
