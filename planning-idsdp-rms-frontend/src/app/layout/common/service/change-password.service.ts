import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChangePasswordService {

  RESET_PASSWORD = environment.ibcs.authServerBackendEndpoint + 'change-password'
  constructor(
    private http: HttpClient
  ) { }

  changePass(data: any) {
    return this.http.post<any>(this.RESET_PASSWORD, data);
  }

}
