import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CrudRequestService } from 'app/main/core/services/crud-request.service';
import { environment } from 'environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MemberInSeminarService extends CrudRequestService {

  baseEndPoint = environment.ibcs.rpmBackend + 'api/member-in-seminar';

  constructor(private http: HttpClient) {
    super(http, environment.ibcs.rpmBackend + 'member-in-seminar/');
  }

  getAllBySeminarId(seminarId: number) {
    const url = this.baseEndPoint + '/find-all-by-create-seminar-id/' + seminarId;
    return this.http.get<any>(url).pipe(map((data: any) => data));
  }


  onSaveOrUpdateList(dataList) {
    const url = this.baseEndPoint + '/save-list';
    return this.http.post<any>(url, dataList).pipe(map((data: any) => data));
  }

}
