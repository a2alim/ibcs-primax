import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from "../../../../environments/environment";
import {EmailModel} from "../model/email.model";

@Injectable({
    providedIn: 'root'
})
export class EmailService {

    private rpmBackend: string = environment.ibcs.rpmBackend;

    constructor(private _http: HttpClient) {
    }


    sentEmail(body: EmailModel): Observable<any> {
        return this._http.post(this.rpmBackend + 'api/mail-service/send-mail', body);
    }

}
