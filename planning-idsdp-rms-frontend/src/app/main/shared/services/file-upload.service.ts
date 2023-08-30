import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from "../../../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class FileUploadService {

    private minioHost: string = environment.ibcs.minioEndPointHost;

    constructor(private _http: HttpClient) {
    }


    uploadFile(file:any, fileName:any, bucketName:any): Observable<any> {
        const formData = new FormData();
        formData.append('file', file);
        return this._http.post(this.minioHost+'/minio/v1/upload?bucketName='+bucketName+'&fileName='+fileName, formData);
    }
   
    getFileSize(files,): Observable<any> {
        
        var totalBytes = files[0].size;
        //console.log('totalBytes = ', totalBytes);
        if(totalBytes > 1000000){        
            var size = Math.floor(totalBytes/1000000); // MB
            return of(size);
        }
        // else{
        //     var size = Math.floor(totalBytes/1000) + 'KB';
        //     console.log(size);
        //     return form(size);
        // }
        return of('0');
       
    }

    fileExtension(files, fileExtension): Observable<any> {
        let fileToUpload = files[0];
        console.log("fileToUpload", fileToUpload);
        let returnVal:any = {"status":false,"message":"File extension don’t match"};
        if(fileExtension.length >0){
            fileExtension.forEach((data) => {
                if(fileToUpload.type == data){
                    returnVal = ({"status":true,"message":"Match extension"});
                }
            });
        }        
        return of(returnVal);

        /*
        fileToUpload.type == "image/jpg"
        fileToUpload.type == "image/jpeg"
        fileToUpload.type == "image/png"
        fileToUpload.type == "application/pdf"
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" //.docx format
        type: "application/vnd.oasis.opendocument.text" //.dto format
        */
      
    }
}
