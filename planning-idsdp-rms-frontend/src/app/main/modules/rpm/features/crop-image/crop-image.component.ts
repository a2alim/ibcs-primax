import { Component, OnInit } from '@angular/core';
import { FuseTranslationLoaderService } from 'app/main/core/services/translation-loader.service';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { locale as lngEnglish } from './i18n/eng';
import { locale as lngBangla } from './i18n/bng';

@Component({
  selector: 'app-crop-image',
  templateUrl: './crop-image.component.html',
  styleUrls: ['./crop-image.component.scss']
})
export class CropImageComponent implements OnInit {

  imageChangedEvent: any = '';
  croppedImage: any = '';

  imageSize = 0;
  RatioWidth = 0;
  RatioHeight = 0;

  constructor( private _fuseTranslationLoaderService: FuseTranslationLoaderService) 
  { 
    this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
  }

  ngOnInit(): void {
      var url_string = window.location.href;
      var url = new URL(url_string);
      let imgSize = url.searchParams.get("size");
      let val = imgSize.split("-")
      //console.log('val= ', val);
      if(val.length == 3){
        this.imageSize = Number(val[0])+0;
        this.RatioWidth = Number(val[1])+0;
        this.RatioHeight = Number(val[2])+0;
      }
  }

  /*----------------------File Crop-------------------------------*/
  fileChangeEvent(event: any): void {
    // show cropper
    this.imageChangedEvent = event;     
}

imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;            
   // console.log('event.base64', event.base64);           
}

imageLoaded() {
    
}

cropperReady() {
    // cropper ready
}

loadImageFailed() {
    // show message
}
/*----------------------/File Crop------------------------------*/

}
