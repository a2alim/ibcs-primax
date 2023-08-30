import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { locale as lngEnglish } from './i18n/en';
import { locale as lngBangla } from './i18n/bn';
import { FuseTranslationLoaderService } from '../../../core/services/translation-loader.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-submit-confirmation-dialog',
    templateUrl: './submit-confirmation-dialog.component.html',
    styleUrls: ['./submit-confirmation-dialog.component.scss'],
})
export class SubmitConfirmationDialogComponent implements OnInit {
    title;
    message;
    profileNumber = 0;
    closeEventEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(
        @Inject(MAT_DIALOG_DATA) data: any,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService
    ) {
        console.log('data', data.profileNumber);
        this.title = data.title;
        this.message = data.message;
        this.profileNumber = data.profileNumber;
        this._fuseTranslationLoaderService.loadTranslations(
            lngEnglish,
            lngBangla
        );
    }

    ngOnInit(): void {}

    confirm(value: boolean): void {
        this.closeEventEmitter.emit(value);
    }
}
