import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CrudRequestService } from 'app/main/core/services/crud-request.service';
import { environment } from 'environments/environment';
import { TaskDetailsModel } from '../models/task-details.model';

@Injectable({
  providedIn: 'root'
})
export class TaskDetailsService extends CrudRequestService<TaskDetailsModel>{

  constructor(http: HttpClient) {
    super(http, environment.ibcs.configurationApiEndPoint + 'task-details/');
  }
}
