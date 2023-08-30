import { Component, OnInit } from '@angular/core';
/*----Lng Translation----*/
import {StepperSelectionEvent} from '@angular/cdk/stepper';
import {locale as lngEnglish} from './i18n/en';
import {locale as lngBangla} from './i18n/bn';
import {FuseTranslationLoaderService} from '../../../../../../core/services/translation-loader.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Router} from "@angular/router";
import {MatStepper} from "@angular/material/stepper";
import { LocationHelperService } from 'app/main/shared/services/location-helper.service';

/*----/Lng Translation----*/
@Component({
  selector: 'app-project-summery-tab',
  templateUrl: './project-summery-tab.component.html',
  styleUrls: ['./project-summery-tab.component.scss']
})
export class ProjectSummeryTabComponent implements OnInit {
    titleEn: string;
    subTitle: string;
    horizontalStepperForm: FormGroup;
    constructor(private _formBuilder: FormBuilder,
        private router: Router,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private locationHelperService: LocationHelperService) {
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

    ngOnInit(): void {
        this.horizontalStepperForm = this._formBuilder.group({
            step1: this._formBuilder.group({}),
            step2: this._formBuilder.group({}),
            step3: this._formBuilder.group({}),
            step4: this._formBuilder.group({}),
            step5: this._formBuilder.group({})
        });
    }

    goBack(stepper: MatStepper): void {
        stepper.previous();
    }

    goForward(stepper: MatStepper): void {
        stepper.next();
    }

    getTitleEn($event: { titleEn: string }) {
        this.titleEn = $event.titleEn;
    }

    getSubTitle($event: { subTitle: string }) {
        this.subTitle = $event.subTitle;
    }

    navigateToDppListPage() {
      this.router.navigate(['rdpp-rtapp']);
    }

    goBackToHome() {
      window.history.back();
    }

    selectionChanged($event: StepperSelectionEvent) {
        if ($event.selectedIndex === 1) {
          this.locationHelperService.setProjectLocationEvent();
        }
    }
}
