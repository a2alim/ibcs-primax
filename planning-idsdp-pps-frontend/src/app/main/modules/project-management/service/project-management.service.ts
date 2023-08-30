import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProjectManagementService {

  private baseUrl;

  constructor(private http: HttpClient) {
    this.baseUrl = environment.ibcs.ppsDppBackendPoint;
  }

  getGrandTotalByProjectConceptIdList(): Observable<number> {
    const url: string = this.baseUrl + 'dpp-dashboard/getGrandTotalByProjectConceptIdList';
    return this.http.get(url).pipe(map((res: any) => { return res; }));
  }
}
