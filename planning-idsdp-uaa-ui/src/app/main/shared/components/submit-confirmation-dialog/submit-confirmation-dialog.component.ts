import {Component, EventEmitter, Inject, OnInit} from '@angular/core';
import {locale as lngEnglish} from './i18n/en';
import {locale as lngBangla} from './i18n/bn';
import {FuseTranslationLoaderService} from '../../../core/services/translation-loader.service';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
    selector: 'app-submit-confirmation-dialog',
    templateUrl: './submit-confirmation-dialog.component.html',
    styleUrls: ['./submit-confirmation-dialog.component.scss']
})
export class SubmitConfirmationDialogComponent implements OnInit {

    otpPayload: any = new Array<{
        status: boolean,
        data: string
    }>();

    otp: any;


    title;
    message;
    closeEventEmitter: EventEmitter<any> = new EventEmitter<any>();

    constructor(@Inject(MAT_DIALOG_DATA) data: any,
                private _fuseTranslationLoaderService: FuseTranslationLoaderService) {
        this.title = data.title;
        this.message = data.message;
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

    ngOnInit(): void {
    }

    confirm(value: boolean): void {
        this.otpPayload.push({
            status: value,
            data: this.otp
        });
        this.closeEventEmitter.emit(this.otpPayload);
    }
}
