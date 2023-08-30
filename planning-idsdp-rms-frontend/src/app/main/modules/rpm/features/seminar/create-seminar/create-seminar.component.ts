import { Component, OnInit } from '@angular/core';
import { FuseTranslationLoaderService } from "../../../../../core/services/translation-loader.service";
import { FormBuilder } from "@angular/forms";
import { locale as lngEnglish } from "../i18n/en";
import { locale as lngBangla } from "../i18n/bn";
import { MatStepper } from "@angular/material/stepper";
import { StepperSelectionEvent } from "@angular/cdk/stepper";

@Component({
    selector: 'app-create-seminar',
    templateUrl: './create-seminar.component.html',
    styleUrls: ['./create-seminar.component.scss']
})
export class CreateSeminarComponent implements OnInit {

    constructor(
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _formBuilder: FormBuilder
    ) {
        // Language translations
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

    ngOnInit(): void {
    }

    goBack(stepper: MatStepper): void {
        stepper.previous();
    }

    goForward(stepper: MatStepper): void {
        stepper.next();
    }

    selectionChanged($event: StepperSelectionEvent) {
        if ($event.selectedIndex === 1) {
        }
    }

    goBackToHome() {
        window.history.back();
    }
}
