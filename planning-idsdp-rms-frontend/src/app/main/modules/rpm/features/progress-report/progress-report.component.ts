import { Component, OnInit } from '@angular/core';
import {FuseTranslationLoaderService} from "../../../../core/services/translation-loader.service";
import {FormBuilder} from "@angular/forms";
import {locale as lngEnglish} from "../progress-report/i18n/en";
import {locale as lngBangla} from "../progress-report/i18n/bn";
import {MatStepper} from "@angular/material/stepper";
import {StepperSelectionEvent} from "@angular/cdk/stepper";
import {SubmitProgressReportServiceService} from "../../services/submit-progress-report-service.service";

@Component({
  selector: 'app-progress-report',
  templateUrl: './progress-report.component.html',
  styleUrls: ['./progress-report.component.scss']
})
export class ProgressReportComponent implements OnInit {

    formTitle: any;

  constructor(
      private _fuseTranslationLoaderService: FuseTranslationLoaderService,
      private _formBuilder: FormBuilder,
      private _submitProgressReport: SubmitProgressReportServiceService,) {

      // Language translations
      this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
  }

  ngOnInit(): void {
      this.formTitle = this._submitProgressReport.mode
  }

    goBack(stepper: MatStepper): void {
        stepper.previous();
    }

    goForward(stepper: MatStepper): void {
        stepper.next();

    }

    selectionChanged($event: StepperSelectionEvent) {
        if ($event.selectedIndex === 0) {

        }
    }

    goBackToHome() {
        window.history.back();
    }

}
