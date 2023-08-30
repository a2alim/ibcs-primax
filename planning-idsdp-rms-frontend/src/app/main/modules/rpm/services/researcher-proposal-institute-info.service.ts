import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CrudRequestService } from 'app/main/core/services/crud-request.service';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ResearcherProposalInstituteInfoService extends CrudRequestService {

  baseEndPoint = environment.ibcs.rpmBackend;

  constructor(private http: HttpClient) {
    super(http, environment.ibcs.rpmBackend + 'api/researcher-proposal-institute-info/');
  }


  findByResearcherProposalId(researcherProposalId: any): Observable<any> {
    const url = this.baseEndPoint + 'api/researcher-proposal-institute-info/find-by-researcher-proposal-id/' + researcherProposalId;
    return this.http.get<any>(url).pipe(map((data: any) => data));
  }


  createResearcherProposalInstituteInfo(data: any, attachedFile: File): Observable<any> {
    const formData = new FormData();
    formData.append('data', JSON.stringify(data));
    formData.append('file', attachedFile);
    const url: string = this.baseEndPoint + 'api/researcher-proposal-institute-info/create-institute-info';
    return this.http.post(url, formData).pipe(map((res: any) => res));
  }


  UpdateResearcherProposalInstituteInfo(data: any, attachedFile: File): Observable<any> {
    const formData = new FormData();
    formData.append('data', JSON.stringify(data));
    formData.append('file', attachedFile);
    const url: string = this.baseEndPoint + 'api/researcher-proposal-institute-info/update-institute-info';
    return this.http.put(url, formData).pipe(map((res: any) => res));
  }


}
