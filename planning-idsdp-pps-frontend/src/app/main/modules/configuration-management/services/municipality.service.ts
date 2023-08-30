import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CrudRequestService} from '../../../core/services/crud-request.service';
import {MunicipalityModel} from '../models/municipality.model';
import {environment} from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MunicipalityService extends CrudRequestService<MunicipalityModel>{

    constructor(http: HttpClient) {
        super(http, environment.ibcs.configurationApiEndPoint + 'municipality/');
    }
}
