import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {environment} from '../../../../environments/environment';
import {CREATE_URL, DELETE_BY_ID, GET_BY_ID_URL, GET_BY_UUID_URL} from '../constants/api';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import { saveAs } from 'file-saver';
import { SnackbarHelper } from '../helper/snackbar.helper';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class FileUploadService {



    baseUrl = 'attachment/';
    constructor(private http: HttpClient,
                private dialog: MatDialog,
                private snackbarHelper: SnackbarHelper) {
    }

    upload(file: File) {
        const formData = new FormData();
        formData.append('attachmentFile', file);

        const uploadImage: string = environment.ibcs.ppsPcBaseEndPoint + this.baseUrl + CREATE_URL;
        return this.http.post(uploadImage, formData).pipe(map((res: any) => {
            return res;
        }));
    }

    uploadInFs(file: File) {
        const formData = new FormData();
        formData.append('attachmentFile', file);

        const uploadImage: string = environment.ibcs.ppsFsBaseEndPoint + this.baseUrl + CREATE_URL;
        return this.http.post(uploadImage, formData).pipe(map((res: any) => {
            return res;
        }));
    }

    uploadFileDppService(file: File) {
        const formData = new FormData();
        formData.append('attachmentFile', file);

        const uploadImage: string = environment.ibcs.ppsDppBackendPoint + this.baseUrl + CREATE_URL;
        return this.http.post(uploadImage, formData).pipe(map((res: any) => {
            return res;
        }));
    }

    uploadFileRdppService(file: File) {
        const formData = new FormData();
        formData.append('attachmentFile', file);

        const uploadImage: string = environment.ibcs.ppsRdppRtappBackendPoint + this.baseUrl + CREATE_URL;
        return this.http.post(uploadImage, formData).pipe(map((res: any) => {
            return res;
        }));
    }

    getById(id: number) {
        return this.http.get<any>(environment.ibcs.ppsPcBaseEndPoint + this.baseUrl + GET_BY_ID_URL + '/' + id);
    }

    getAttachmentByIdInDppService(id: number) {
        return this.http.get<any>(environment.ibcs.ppsDppBackendPoint + this.baseUrl + GET_BY_ID_URL + '/' + id);
    }

    getAttachmentByIdInRdppService(id: number) {
        return this.http.get<any>(environment.ibcs.ppsRdppRtappBackendPoint + this.baseUrl + GET_BY_ID_URL + '/' + id);
    }

    getByIdFromFs(id: number) {
        return this.http.get<any>(environment.ibcs.ppsFsBaseEndPoint + this.baseUrl + GET_BY_ID_URL + '/' + id);
    }

    deleteById(id: number) {
        return this.http.delete<any>(environment.ibcs.ppsPcBaseEndPoint + this.baseUrl + DELETE_BY_ID + '/' + id);
    }

    deleteByIdDpp(id: number) {
        return this.http.delete<any>(environment.ibcs.ppsDppBackendPoint + this.baseUrl + DELETE_BY_ID + '/' + id);
    }

    deleteByIdFs(id: number) {
        return this.http.delete<any>(environment.ibcs.ppsFsBaseEndPoint + this.baseUrl + DELETE_BY_ID + '/' + id);
    }

    download(pdfUrl: string) {
        const httpOptions = {
            'responseType'  : 'blob' as 'json'
        };
        const url = environment.ibcs.ppsPcBaseEndPoint + pdfUrl;
        return this.http.get<any>(url, httpOptions).subscribe( res=> {
            saveAs(res);
        });
    }

    downloadAttachmentInDppService(pdfUrl: string) {
        const httpOptions = {
            'responseType'  : 'blob' as 'json'
        };
        const url = environment.ibcs.ppsDppBackendPoint + pdfUrl;
        return this.http.get<any>(url, httpOptions).subscribe( res=> {
            saveAs(res);
        });
    }

    downloadAttachmentInRdppService(pdfUrl: string) {
        const httpOptions = {
            'responseType'  : 'blob' as 'json'
        };
        const url = environment.ibcs.ppsRdppRtappBackendPoint + pdfUrl;
        return this.http.get<any>(url, httpOptions).subscribe( res=> {
            saveAs(res);
        });
    }

    downloadAttachmentInFsService(pdfUrl: string) {
        const httpOptions = {
            'responseType'  : 'blob' as 'json'
        };
        const url = environment.ibcs.ppsFsBaseEndPoint + pdfUrl;
        return this.http.get<any>(url, httpOptions).subscribe( res=> {
            saveAs(res);
        });
    }

    downloadAttachmentFromReport(pdfUrl){
        const httpOptions = {
            'responseType'  : 'blob' as 'json'
        };
        const url = environment.ibcs.ppsReportEndPoint + pdfUrl;
        return this.http.get<any>(url, httpOptions).subscribe( res=> {
            saveAs(res);
        });
    }

    uploadApprovalProcessFlowAttachment(file: File,projectMovementStage:any) {
        const formData = new FormData();
        formData.append('attachmentFile', file);
        formData.append('projectMovementStageId', projectMovementStage.id)
        const uploadAttachment: string = environment.ibcs.ppsDppBackendPoint + "project-movement-stage/save-attachment";


        return this.http.post(uploadAttachment, formData).pipe(res=>{
            return res;
        });
    }

    uploadConditionalEcnecAttachment(file: File,conditions:any){
        const url = environment.ibcs.ppsDppBackendPoint + "project-movement-stage/save-conditional-ecnec-approve";
        const formData = new FormData();
        formData.append('ecnecConditionsRequest',(JSON.stringify(conditions)));
        formData.append('attachmentFile', file);
        return this.http.post(url, formData).pipe(res=>{
            return res;
        });
    }

    downloadDppAttachementsZip(pc_id) {
        const url = environment.ibcs.ppsDppBackendPoint + "zip-download/"+pc_id;
        const httpOptions = {
            'responseType'  : 'blob' as 'json'
        };
        return this.http.get<any>(url,httpOptions).subscribe(res=>{
            const blob = new Blob([res], {
                type: 'application/zip'
              });
            const url = window.URL.createObjectURL(blob);
            saveAs(url);
        },error=>{
            this.snackbarHelper.openErrorSnackBarWithMessage('Error Occured in downloading', 'OK');
        });
    }

    uploadDppTappPresentation(obj:any):Observable<any>{
        const formData = new FormData();
        formData.append("presentationFile", obj.presentationFile);
        formData.append("body", JSON.stringify(obj));
        const url = environment.ibcs.ppsDppBackendPoint + "/presentations/add-presentation";
        return this.http.post(url,formData);
    }


}
