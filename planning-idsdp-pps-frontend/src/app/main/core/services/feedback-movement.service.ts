import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FeedbackMovementService {

  constructor(private http: HttpClient) { }

  feedbackByIdUrl = environment.ibcs.enothiBackendPoint+'feedbacks-by-id/';
  daakSubmissionUrl = environment.ibcs.enothiBackendPoint+'daakSubmission/';

  getFeedbackById(srcUserGroup,project_concept_uuid,feasability_uuid,dpp_uuid,tapp_uuid):Observable<any>{
    let headers = new HttpHeaders();
    headers.set('Content-Type', 'application/json');
    let params = new HttpParams().append('src-user-group', srcUserGroup).append('pc-uuid', project_concept_uuid).append('fs-uuid', feasability_uuid).append('dpp-uuid', dpp_uuid).append('tapp_uuid', tapp_uuid);
    return this.http.get(this.feedbackByIdUrl,{ headers, params });
  }

  getDaakSubmission(srcUserGroup,project_concept_uuid,feasability_uuid,dpp_uuid,tapp_uuid):Observable<any>{
    let headers = new HttpHeaders();
    headers.set('Content-Type', 'application/json');
    let params = new HttpParams().append('src-user-group', srcUserGroup).append('pc-uuid', project_concept_uuid).append('fs-uuid', feasability_uuid).append('dpp-uuid', dpp_uuid).append('tapp_uuid', tapp_uuid);
    return this.http.get(this.daakSubmissionUrl,{ headers, params });
  }


}
