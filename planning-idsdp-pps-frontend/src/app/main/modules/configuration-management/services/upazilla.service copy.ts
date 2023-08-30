import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CrudRequestService} from '../../../core/services/crud-request.service';
import {UpazillaModel} from '../models/upazilla.model';

@Injectable({
  providedIn: 'root'
})
export class UpazillaService extends CrudRequestService<UpazillaModel>{

    constructor(http: HttpClient) {
        super(http, 'upazilla/');
    }
}
