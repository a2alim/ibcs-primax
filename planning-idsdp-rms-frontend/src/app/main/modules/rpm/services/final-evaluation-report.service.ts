import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CoreResponse } from 'app/main/core/models/response';
import { CrudRequestService } from 'app/main/core/services/crud-request.service';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FinalEvaluationReportService extends CrudRequestService {

  constructor(private http: HttpClient) {
    super(http, `${environment.ibcs.rpmBackend}final-evaluation-report/`);
  }

  createOrUpdate(data: any) {
    return this.http.post<CoreResponse<any>>(this._BASE_URL + '/create-or-update', data);
  }

}
