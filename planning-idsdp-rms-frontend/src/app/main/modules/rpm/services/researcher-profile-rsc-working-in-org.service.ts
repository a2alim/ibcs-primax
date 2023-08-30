import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CrudRequestService } from 'app/main/core/services/crud-request.service';
import { environment } from 'environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ResearcherProfileRscWorkingInOrgService extends CrudRequestService {

  baseEndPoint = environment.ibcs.rpmBackend + 'researcher-profile-rsc-workingin-org';

  constructor(private http: HttpClient) {
    super(http, environment.ibcs.rpmBackend + 'researcher-profile-rsc-workingin-org/');
  }

  getAllByResearcherProfileId(researcherProfileId: number) {
    const url = this.baseEndPoint + '/get-list-find-by-researcher-profile-id/' + researcherProfileId;
    return this.http.get<any>(url).pipe(map((data: any) => data));
  }

  getAllByResearcherUserId(userId: number) {
    const url = this.baseEndPoint + '/get-list-find-by-user-id/' + userId;
    return this.http.get<any>(url).pipe(map((data: any) => data));
  }

  // onSaveOrUpdateList(dataList){
  //   const url = this.baseEndPoint + '/save-list';
  //   return this.http.post<any>(url,dataList).pipe(map((data: any) => data));
  // }

  // onSaveOrUpdateList(dataList){
  //   const url = this.baseEndPoint + '/save-list';
  //   return this.http.post<any>(url,dataList).pipe(map((data: any) => data));
  // }

  onSaveOrUpdateList(dataList, files: File[], updatedFileList: any[]) {
    const formData = new FormData();
    formData.append('body', JSON.stringify(dataList));

    if (updatedFileList != null) {
      for (var i = 0; i < updatedFileList.length; i++) {
        if (!updatedFileList[i]) {
          updatedFileList[i] = 0;
        }
      }
    }

    updatedFileList = updatedFileList.filter(f => f != 0);
    formData.append('updatedFileList', JSON.stringify(updatedFileList));

    if (files != null) {
      for (var i = 0; i < files.length; i++) {
        formData.append('file', files[i]);
      }
    }

    const url = this.baseEndPoint + '/save-list-with-file';
    return this.http.post<any>(url, formData).pipe(map((data: any) => data));
  }

}
