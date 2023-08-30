import {Injectable} from '@angular/core';
import {CrudRequestService} from '../../../core/services/crud-request.service';
import {JustificationType} from '../models/justification-type.model';
import {HttpClient} from '@angular/common/http';
import {JUSTIFICATION_TYPE} from '../constants/justification-type.constant';

@Injectable({
    providedIn: 'root'
})
export class JustificationTypeService extends CrudRequestService<JustificationType> {

    constructor(httpClient: HttpClient) {
        super(httpClient, JUSTIFICATION_TYPE);
    }
}
