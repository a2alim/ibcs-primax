import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EnothiDakSubmissionService {

  constructor(private http: HttpClient, private cookieService: CookieService) { }

  submissionUrl = environment.ibcs.enothiBackendPoint+'submit-application';

  // submissionUrl = 'http://223.27.82.138/feedback/index.php';

  submitDak(applicationSubject):Observable<any>{

    let doptor_token = sessionStorage.getItem('doptor_token');
    const headers = new HttpHeaders().set('doptor_token', doptor_token);
    applicationSubject.doptorToken = doptor_token;

    //return this.http.post(this.submissionUrl+"?module="+moduleName,{headers},null);
     return this.http.post(this.submissionUrl + "?module=" + applicationSubject.sourceModule, applicationSubject, {headers: headers});
  }

}
