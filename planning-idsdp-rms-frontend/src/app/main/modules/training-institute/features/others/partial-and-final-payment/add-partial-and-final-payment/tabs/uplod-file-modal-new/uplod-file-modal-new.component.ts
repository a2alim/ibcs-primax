import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FuseTranslationLoaderService } from 'app/main/core/services/translation-loader.service';
import { closeIcon } from 'app/main/modules/rpm/constants/button.constants';
import { GoLetterServiceService } from 'app/main/modules/rpm/services/go-letter-service.service';
import { GoLetterModel } from 'app/main/modules/training-institute/models/go-letter.model';
import { ToastrService } from 'ngx-toastr';
import { locale as lngEnglish } from './i18n/en';
import { locale as lngBangla } from './i18n/bn';
import { PaymentBillVoucherModel } from 'app/main/modules/training-institute/models/partial-final-payment.model';
import { PartialFinalPaymentService } from 'app/main/modules/training-institute/services/partial-final-payment.service';

@Component({
  selector: 'app-uplod-file-modal-new',
  templateUrl: './uplod-file-modal-new.component.html',
  styleUrls: ['./uplod-file-modal-new.component.scss']
})
export class UplodFileModalNewComponent implements OnInit {

  closeEventEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();
  spinner: boolean;
  file: File;
  closeIcon = closeIcon;
  goLetterModel: PaymentBillVoucherModel = new PaymentBillVoucherModel();
  config: { timeOut: 5000; closeButton: true; positionClass: 'toast-top-right'; enableHtml: true; };

  constructor(
    @Inject(MAT_DIALOG_DATA) data: PaymentBillVoucherModel,
    private dialog: MatDialog,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    private _partialFinalPaymentService: PartialFinalPaymentService,
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
    this._partialFinalPaymentService.uploadDocument(this.goLetterModel, this.file).subscribe(
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
