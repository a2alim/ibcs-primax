import {Component, OnInit} from '@angular/core';
import {FuseTranslationLoaderService} from "../../../../../core/services/translation-loader.service";
import {ActivatedRoute, Router} from "@angular/router";
import {SnackbarHelper} from "../../../../../core/helper/snackbar.helper";
import {locale as lngEnglish} from "./i18n/en";
import {locale as lngBangla} from "./i18n/bn";
import {UnsubscribeAdapterComponent} from "../../../../../core/helper/unsubscribeAdapter";

@Component({
    selector: 'app-add-researcher-presentation',
    templateUrl: './add-researcher-presentation.component.html',
    styleUrls: ['./add-researcher-presentation.component.scss']
})
export class AddResearcherPresentationComponent extends UnsubscribeAdapterComponent implements OnInit {

    spinner = true;

    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
                private activatedRoute: ActivatedRoute,
                private router: Router,
                private snackbarHelper: SnackbarHelper) {
        super();
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

    ngOnInit(): void {
        this.spinner = false;
    }

}
