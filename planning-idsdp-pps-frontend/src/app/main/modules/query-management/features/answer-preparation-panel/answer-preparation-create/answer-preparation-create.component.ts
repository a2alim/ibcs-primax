import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {FuseTranslationLoaderService} from '../../../../../core/services/translation-loader.service';
import {locale as lngBangla} from '../answer-preparation-create/i18n/bn';
import {locale as lngEnglish} from '../answer-preparation-create/i18n/en';
import {FuseAnimations} from '../../../../../../../@fuse/animations';

@Component({
    selector: 'app-answer-preparation-create',
    templateUrl: './answer-preparation-create.component.html',
    styleUrls: ['./answer-preparation-create.component.scss'],
    animations : FuseAnimations
})
export class AnswerPreparationCreateComponent implements OnInit {

    form: FormGroup;
    fileName = '';
    viewAns = false;

    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
                private formBuilder: FormBuilder) {
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);

    }

    ngOnInit(): void {
        this.form = this.formBuilder.group({
            projectTypeSearch: ['', ''],
            askBySearch: ['', ''],
            locationSearch: ['', ''],
            implementingAgencySearch: ['', ''],
            questionSourceSearch: ['', ''],
            fiscalYearSearch: ['', ''],
            questionSource: ['', ''],
            questionType: ['', ''],
            questionTitle: ['', ''],
            description: ['', ''],
            attachment: ['', '']
        });
    }

    fileHandeller(event) {
        const file = event.target.files[0];
        this.fileName = file.name;
    }

    enabledDisableViewDiv(actino){
        this.viewAns = actino;
    }

}

