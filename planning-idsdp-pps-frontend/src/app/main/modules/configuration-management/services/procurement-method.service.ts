import { Injectable } from '@angular/core';
import {map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {CrudRequestService} from '../../../core/services/crud-request.service';
import {ProcurementMethodModel} from '../models/procurement-method.model';
import {environment} from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProcurementMethodService extends CrudRequestService<ProcurementMethodModel>{

  constructor(http: HttpClient) {
      super(http, environment.ibcs.configurationApiEndPoint + 'procurementMethod/');
  }


}
