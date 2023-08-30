import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CrudRequestService } from 'app/main/core/services/crud-request.service';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ResearchFinalSubmissionService  extends CrudRequestService {

  BASE_END_POINT = environment.ibcs.rpmBackend+'research-final-submission';
  FIND_BY_PROPOSAL_ID = `${this.BASE_END_POINT}/find-by-m1-researcher-proposal-id`;
  FIND_BY_PROPOSAL_INFO_BY_UUID = environment.ibcs.rpmBackend+'api/researcher-proposal/get-by-uuid/'

  constructor(
    private http: HttpClient
  ) {
    super(http, environment.ibcs.rpmBackend + 'research-final-submission/');
  }

  onSaveOrUpdate(data) {
    if(data.id){
      return this.update(data);
    }else{
      return this.create(data);
    }
  }

  findByResearcherProposalId(m1ResearcherProposalId: any): Observable<any> {
    return this.http.get<any>(this.FIND_BY_PROPOSAL_ID+"/"+m1ResearcherProposalId).pipe(map((data: any) => data));
  }

  getProposalInfoByUuid(ProposalUuid: any): Observable<any> {
    return this.http.get<any>(this.FIND_BY_PROPOSAL_INFO_BY_UUID+"/"+ProposalUuid).pipe(map((data: any) => data));
  }

  submitFinalReport(id: any): Observable<any> {
    // return this.http.get<any>(`${this.BASE_END_POINT}/final-submit/${id}`).pipe(map((data: any) => data));
    // const url = this.baseEndPoint + '/save-list';
    //return this.http.post<any>(`${this.BASE_END_POINT}/final-submit/${id}`,{}).pipe(map((data: any) => data));
    return this.http.get<any>(`${this.BASE_END_POINT}/final-submit/${id}`, {});
  }

}
