import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
@Injectable({ providedIn: 'root' })
export class FileValidatorService {
    FOLDER = '/';

    imageUrl = "";

    resData: BehaviorSubject<any> = new BehaviorSubject(null);

    data = {message: "", data: ""};

    constructor() {
    }

    isValidateFileHeightWidth(callback,file, Iheight, Iwidth) {
      var  isValid: boolean = false;

        let fileToUpload = file;
        if (this.isValidImage(file)) {
            //Show image preview
            let reader = new FileReader();
            reader.onload = (event: any) => {
                var img = new Image();
                img.onload = () => {
                    let width = img.width;
                    let height = img.height;
                    // console.log('Valid Image Height :');
                    // console.log(height+'--'+Iheight);
                    // console.log('Valid Image Weight :');
                    // console.log(width+'--'+Iwidth);
                    if (width <= Iwidth && height <= Iheight) {
                        this.imageUrl = event.target.result;
                        isValid = true;
                        callback(isValid);
                    }else{
                        callback(isValid);
                    }
                };

                img.src = event.target.result;
            }
            reader.readAsDataURL(fileToUpload);
        }


    }

    isValidImage(file) {
        let fileToUpload = file;
        if (fileToUpload.type == "image/jpeg" || fileToUpload.type == "image/png" || fileToUpload.type == "image/jpeg") {
            return true;
        } else {
            return false;
        }
    }

    isValidImageSize(file, fileSizeInKB) {
        if(fileSizeInKB !== null){
        if ((file.size / 1000) <= fileSizeInKB) {
            return true;
        } else {
            return false;
        }
        }else{
            return true;
        }
    }

    // create by bulbul 

    checkFileExtension(file, extensionArray = []){
        var ext = file.item(0).name.split('.').pop();
        if (extensionArray.indexOf(ext.toLowerCase()) == -1) {
            return false;
        }
        else{
            return  true;
        }
    }

    checkUploadFileSize(file,needFileSize:number){
        var fileSize = Math.round((file[0].size / 1024));             
        if (fileSize <= needFileSize*1024) {
            return true
        } else {
            return false;
        }
    }
}
