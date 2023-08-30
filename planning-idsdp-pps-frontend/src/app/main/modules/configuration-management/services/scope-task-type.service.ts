import {Injectable} from '@angular/core';
import {CrudRequestService} from '../../../core/services/crud-request.service';
import {HttpClient} from '@angular/common/http';
import {ScopeTaskType} from '../models/scope-task-type.model';
import {SCOPE_TASK_TYPE} from '../constants/scope-task-type.constant';

@Injectable({
    providedIn: 'root'
})
export class ScopeTaskTypeService extends CrudRequestService<ScopeTaskType> {

    constructor(httpClient: HttpClient) {
        super(httpClient, SCOPE_TASK_TYPE);
    }
}
