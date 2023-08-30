import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NothiUserService {

  constructor(private http: HttpClient) { }

  getNothiUserByNothiDaakSender(empId):Observable<any>{
    const url = environment.ibcs.authServerBackendEndpoint + 'nothi-user-by-nothiId/'+empId;
    return this.http.get(url)
  }
}
