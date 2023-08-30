import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FuseTranslationLoaderService } from 'app/main/core/services/translation-loader.service';
import { locale as lngEnglish } from "./i18n/en";
import { locale as lngBangla } from "./i18n/bn";

@Component({
  selector: 'app-show-details-modal',
  templateUrl: './show-details-modal.component.html',
  styleUrls: ['./show-details-modal.component.scss']
})
export class ShowDetailsModalComponent implements OnInit {

  closeEventEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();

  details: { id: null, uuid: null, title: '', details: '', isActive: true, lang: string }

  constructor(@Inject(MAT_DIALOG_DATA) data: { id: null, uuid: null, title: '', details: '', isActive: true, lang: string },
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    private dialog: MatDialog
  ) {
    this.details = data;
    this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
  }

  ngOnInit(): void {
    //console.log('details ==== >>>> ', this.details);
  }

  onClose(value: boolean) {
    this.dialog.closeAll();
  };

}
