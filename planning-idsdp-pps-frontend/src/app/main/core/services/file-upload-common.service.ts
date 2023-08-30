import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {CREATE_URL, DELETE_URL, GET_BY_ID_URL} from '../constants/api';
import {MatDialog} from '@angular/material/dialog';
import {Observable} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class FileUploadCommonService {

    baseUrl = 'attachment/';

    constructor(private http: HttpClient,
                private dialog: MatDialog) {
    }

    upload(file: File, contextPath: string) {
        const formData = new FormData();
        formData.append('attachmentFile', file);

        const uploadImage: string = contextPath + this.baseUrl + CREATE_URL;
        return this.http.post(uploadImage, formData).pipe(map((res: any) => {
            return res;
        }));
    }

    getById(id: number, contextPath: string) {
        return this.http.get<any>(contextPath + this.baseUrl + GET_BY_ID_URL + '/' + id);
    }

    download(pdfUrl: string, url: string) {
        // const url = environment.ibcs.ppsPcBaseEndPoint;
        window.open(url + pdfUrl);
    }

    deleteAttachment(contextPath: string, attachmentId: number): Observable<any> {
        return this.http.delete<any>(contextPath + this.baseUrl + DELETE_URL + '/' + attachmentId);
    }
}
