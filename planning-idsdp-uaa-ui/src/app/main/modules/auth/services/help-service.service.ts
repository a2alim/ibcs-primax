import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class HelpServiceService {

  BASE_URL : string = environment.ibcs.baseApiEndPoint;
  IMS_HELP_CREATE_URL : string = `${this.BASE_URL}api/help/create`;



  constructor(
    private httpClient: HttpClient,

  ) { }

 
  create(data: any): Observable<any> {
    return this.httpClient.post<any>(this.IMS_HELP_CREATE_URL , data);
}


}
