import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CoreResponse } from 'app/main/core/models/response';
import { CrudRequestService } from 'app/main/core/services/crud-request.service';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';
@Injectable({
    providedIn: 'root',
})
export class AppResearcherProposalUploadDocService extends CrudRequestService {
    baseEndPoint = environment.ibcs.rpmBackend;
    constructor(private http: HttpClient) {
        super(
            http,
            environment.ibcs.rpmBackend + 'api/researcher-proposal-upload-doc/'
        );
    }
    // onSaveOrUpdateList(dataList, files: File[], updatedFileList: any[]) {
    //   const formData = new FormData();
    //   formData.append('body', JSON.stringify(dataList));
    //   if (updatedFileList != null) {
    //     for (var i = 0; i < updatedFileList.length; i++) {
    //       if (!updatedFileList[i]) {
    //         updatedFileList[i] = 0;
    //       }
    //     }
    //   }
    //   updatedFileList = updatedFileList.filter(f => f != 0);
    //   formData.append('updatedFileList', JSON.stringify(updatedFileList));
    //   if (files != null) {
    //     for (var i = 0; i < files.length; i++) {
    //       formData.append('file', files[i]);
    //     }
    //   }
    //   console.log('FormData: ');
    //   console.log(formData);
    //   const url = this.baseEndPoint + 'api/researcher-proposal-upload-doc/upload-researcher-proposal-doc-list';
    //   return this.http.post<any>(url, formData).pipe(map((data: any) => data));
    // }
    onSaveOrUpdateList(data: any): Observable<any> {
        return this.http.post<CoreResponse<any>>(
            this.baseEndPoint +
                'api/researcher-proposal-upload-doc/upload-researcher-proposal-doc-list',
            data
        );
    }
    findByResearcherProposalId(researcherProposalId: any): Observable<any> {
        const url =
            this.baseEndPoint +
            'api/researcher-proposal-upload-doc/get-by-researcher-proposal-id/' +
            researcherProposalId;
        return this.http.get<any>(url).pipe(map((data: any) => data));
    }
    findByResearcherProposalUuid(researcherProposalUuid: any): Observable<any> {
        const url =
            this.baseEndPoint +
            'api/researcher-proposal-upload-doc/get-by-researcher-proposal-uuid/' +
            researcherProposalUuid;
        return this.http.get<any>(url).pipe(map((data: any) => data));
    }
    uploadDocFile(data: any, attachedFile: File): Observable<any> {
        console.log('data === >>> ', data);
        console.log('attachedFile === >>> ', attachedFile);
        const formData = new FormData();
        formData.append('data', JSON.stringify(data));
        formData.append('file', attachedFile);
        const url: string =
            this.baseEndPoint +
            'api/researcher-proposal-upload-doc/upload-doc-files';
        return this.http.post(url, formData).pipe(map((res: any) => res));
    }
}
