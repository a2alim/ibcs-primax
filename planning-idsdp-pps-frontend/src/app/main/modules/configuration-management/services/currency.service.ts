import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CrudRequestService} from '../../../core/services/crud-request.service';
import {environment} from '../../../../../environments/environment';
import {CurrencyModel} from "../models/currency.model";

@Injectable({
  providedIn: 'root'
})
export class CurrencyService extends CrudRequestService<CurrencyModel>{

    constructor(private http: HttpClient) {
        super(http, environment.ibcs.configurationApiEndPoint + 'currency/');
    }

}
