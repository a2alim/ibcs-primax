import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CrudRequestService} from '../../../core/services/crud-request.service';
import {UnitTypeModel} from '../models/unit-type.model';
import {environment} from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UnitTypeService extends CrudRequestService<UnitTypeModel>{

    constructor(http: HttpClient) {
        super(http, environment.ibcs.configurationApiEndPoint + 'unit-type/');
    }
}
