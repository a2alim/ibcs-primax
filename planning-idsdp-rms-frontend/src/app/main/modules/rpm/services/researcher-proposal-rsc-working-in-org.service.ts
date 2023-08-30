import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CrudRequestService } from 'app/main/core/services/crud-request.service';
import { environment } from 'environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ResearcherProposalRscWorkingInOrgService extends CrudRequestService{

  baseEndPoint = environment.ibcs.rpmBackend;

  constructor(private http: HttpClient) {
      super(http, environment.ibcs.rpmBackend + 'api/researcher-proposal-institute-info/');
  }

  getAllfindByResearcherProposalId(researcherProposalId : number){
    const url = this.baseEndPoint + 'api/researcher-proposal-rsc-workingin-org/get-list-find-by-researcher-proposal-id/'+researcherProposalId;
    return this.http.get<any>(url).pipe(map((data: any) => data));
  }

  onSaveOrUpdateList(dataList){
    const url = this.baseEndPoint + 'api/researcher-proposal-rsc-workingin-org/save-list';
    return this.http.post<any>(url,dataList).pipe(map((data: any) => data));
  }

}
