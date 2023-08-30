import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatStepper} from '@angular/material/stepper';
import {ActivatedRoute, Router} from '@angular/router';
import {FuseTranslationLoaderService} from '../../../../../../core/services/translation-loader.service';
import { locale as lngEnglish } from './i18n/en';
import { locale as lngBangla } from './i18n/bn';

@Component({
  selector: 'app-add-feasibility-study-report',
  templateUrl: './add-feasibility-study-report.component.html',
  styleUrls: ['./add-feasibility-study-report.component.scss']
})
export class AddFeasibilityStudyReportComponent implements OnInit {
    verticalStepperForm: FormGroup;
    horizontalStepperForm: FormGroup;

  constructor(private _formBuilder: FormBuilder, private router: Router,
              private _activatedRoute: ActivatedRoute,
              private fuseTranslationLoaderService: FuseTranslationLoaderService) {
      this.fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
  }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Horizontal stepper form
        this.horizontalStepperForm = this._formBuilder.group({
            step1: this._formBuilder.group({}),
            step2: this._formBuilder.group({}),
            step3: this._formBuilder.group({}),
            step4: this._formBuilder.group({}),
            step5: this._formBuilder.group({}),
            step6: this._formBuilder.group({})
        });
    }

    goBack(stepper: MatStepper): void{
        stepper.previous();
    }

    goForward(stepper: MatStepper): void{
        stepper.next();
    }

    save(): any {
        this.router.navigate(['feasibility-study']);
    }

    navigateToList(): any {
        this.router.navigate(['feasibility-study']);
    }

    navigateToDashboard() {
        this.router.navigate(['feasibility-study/view-dashboard/' + this._activatedRoute.snapshot.paramMap.get('uuid')]);
    }
}
