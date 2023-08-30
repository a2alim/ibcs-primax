import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MatStepper} from '@angular/material/stepper';
import {ActivatedRoute, Router} from '@angular/router';
import {FuseTranslationLoaderService} from '../../../../../../core/services/translation-loader.service';
import {locale as lngEnglish} from './i18n/en';
import {locale as lngBangla} from './i18n/bn';
import {StepperSelectionEvent} from "@angular/cdk/stepper";

@Component({
    selector: 'app-add-feasibility-study',
    templateUrl: './add-feasibility-study-proposal.component.html',
    styleUrls: ['./add-feasibility-study-proposal.component.scss']
})
export class AddFeasibilityStudyProposalComponent implements OnInit {

    verticalStepperForm: FormGroup;
    horizontalStepperForm: FormGroup;

    constructor(private _formBuilder: FormBuilder,
                private router: Router,
                private _activatedRoute: ActivatedRoute,
                private _fuseTranslationLoaderService: FuseTranslationLoaderService) {
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

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

    goBack(stepper: MatStepper): void {
        stepper.previous();
    }

    goForward(stepper: MatStepper): void {
        stepper.next();
    }

    save(): any {
        this.router.navigate(['feasibility-study']);
    }

    stepChanged(event: StepperSelectionEvent){
        event.selectedStep.interacted = false;
    }

    navigateToList(): any {
        this.router.navigate(['feasibility-study']);
    }

    navigateToDashboard() {
        this.router.navigate(['feasibility-study/edit-dashboard/' + this._activatedRoute.snapshot.paramMap.get('uuid')]);
    }

}
