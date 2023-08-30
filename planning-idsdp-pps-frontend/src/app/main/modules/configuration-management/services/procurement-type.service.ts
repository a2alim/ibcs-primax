import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CrudRequestService} from '../../../core/services/crud-request.service';
import {ProcurementTypeModel} from '../models/procurement-type.model';
import {environment} from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProcurementTypeService extends CrudRequestService<ProcurementTypeModel>{

    constructor(http: HttpClient) {
        super(http, environment.ibcs.configurationApiEndPoint + 'procurementType/');
    }
}
