import { Component, EventEmitter, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDialogModel } from '../../model/confirm.dialog.model';
import { ConfirmDialogConstant } from '../../constant/confirm.dialog.constant';
import { FuseTranslationLoaderService } from 'app/main/core/services/translation-loader.service';
import { locale as lngBangla } from './i18n/bn';
import { locale as lngEnglish } from './i18n/en';
@Component({
    templateUrl: './confirm-dialog.component.html',
    styleUrls: ['./confirm-dialog.component.scss'],
})
export class ConfirmDialogComponent {
    success = ConfirmDialogConstant.SUCCESS;
    close = ConfirmDialogConstant.CLOSE;
    closeEventEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();
    showModal = true;
    constructor(
        public dialogRef: MatDialogRef<ConfirmDialogComponent>,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogModel
    ) {
        this.showModal = data.showModal;
        // Language translations
        this._fuseTranslationLoaderService.loadTranslations(
            lngEnglish,
            lngBangla
        );
    }

    onNoClick(): void {
        this.dialogRef.close();
    }
    onNoOpen(): void {
        this.dialogRef.afterOpened();
    }

    toggleModal() {
        this.showModal = !this.showModal;
    }

    confirm(value: boolean): void {
        if(value == false)
        {
            this.showModal =  false;
        }
        this.closeEventEmitter.emit(value);
    }
}
