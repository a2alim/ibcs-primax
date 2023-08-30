import { StepperSelectionEvent } from "@angular/cdk/stepper";
import { Component, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { MatStepper } from "@angular/material/stepper";
import {
  addNewIcon,
  nextIcon,
  previousIcon,
  refreshIcon,
  saveIcon,
} from "app/main/modules/rpm/constants/button.constants";
import { FuseTranslationLoaderService } from "../../../../../core/services/translation-loader.service";
import { locale as lngBangla } from "./i18n/bn";
import { locale as lngEnglish } from "./i18n/en";

@Component({
  selector: "app-research-progress-report",
  templateUrl: "./research-progress-report.component.html",
  styleUrls: ["./research-progress-report.component.scss"],
})
export class ResearchProgressReportComponent implements OnInit {
  constructor(
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    private _formBuilder: FormBuilder
  ) {
    // Language translations
    this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
  }

  /*----Button---*/
  refreshIcon = refreshIcon;
  saveIcon = saveIcon;
  previousIcon = previousIcon;
  addNewIcon = addNewIcon;
  nextIcon = nextIcon;
  /*----/Button---*/

  ngOnInit(): void {}
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
