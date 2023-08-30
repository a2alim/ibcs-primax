import {Injectable} from '@angular/core';
import {environment} from "../../../../../environments/environment";
import {HttpClient} from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class GoLetterService {
    baseTiEndPoint = environment.ibcs.tiBackend;

    constructor(private http: HttpClient) {
    }

    saveGoLetter(submitData: any) {
        return this.http.post(this.baseTiEndPoint + 'go-letter', submitData);
    }
}
