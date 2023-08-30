import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SnackbarHelper } from 'app/main/core/helper/snackbar.helper';
import { FuseTranslationLoaderService } from 'app/main/core/services/translation-loader.service';
import { closeIcon } from 'app/main/modules/rpm/constants/button.constants';
import { locale as lngEnglish } from './i18n/en';
import { locale as lngBangla } from './i18n/bn';
import { GoLetterModel } from 'app/main/modules/rpm/models/GoLetterModel';
import { GoLetterServiceService } from 'app/main/modules/rpm/services/go-letter-service.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-uplod-file-modal',
  templateUrl: './uplod-file-modal.component.html',
  styleUrls: ['./uplod-file-modal.component.scss']
})
export class UplodFileModalComponent implements OnInit {

  closeEventEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();
  spinner: boolean;
  file: File;
  closeIcon = closeIcon;
  goLetterModel: GoLetterModel = new GoLetterModel();
  config: { timeOut: 5000; closeButton: true; positionClass: 'toast-top-right'; enableHtml: true; };

  constructor(
    @Inject(MAT_DIALOG_DATA) data: GoLetterModel,
    private dialog: MatDialog,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,    
    private _goLetterServiceService: GoLetterServiceService,
    private toastr: ToastrService,
  ) {
    this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    this.goLetterModel = data;
  }

  ngOnInit(): void {
  }

  uploadFile(file: FileList) {
    this.file = file.item(0);
  }

  onClose(value: boolean) {
    this.dialog.closeAll();
  };


  onSaveOrUpdate() {   
    this.spinner = true;
    this._goLetterServiceService.uploadDocument(this.goLetterModel, this.file).subscribe(
      response => {
        if (response.success) {
          this.goLetterModel = { ...response.obj };
          this.toastr.success(response.message, "", this.config);
        } else {
          this.toastr.error(response.message, "", this.config);
        }
        this.spinner = false;
        this.closeEventEmitter.emit(true);
      }
      , error => {
        this.toastr.error("Http error occeared !.", "", this.config);
        this.spinner = false;
        this.dialog.closeAll();
      }
    );
  }
}
