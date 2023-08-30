import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
/*----Lng Translation----*/
import {locale as lngEnglish} from './i18n/en';
import {locale as lngBangla} from './i18n/bn';
import {FuseTranslationLoaderService} from '../../../../../../core/services/translation-loader.service';
import {MatStepper} from "@angular/material/stepper";
import {ActivatedRoute, Router} from "@angular/router";
import {StepperSelectionEvent} from '@angular/cdk/stepper';
import {LocationHelperService} from '../../../../../../shared/services/location-helper.service';
import {DppObjectiveCostService} from "../../../../services/dpp-objective-cost.service";

/*----/Lng Translation----*/

@Component({
    selector: 'app-dpp-tapp-tab',
    templateUrl: './dpp-tapp-tab.component.html',
    styleUrls: ['./dpp-tapp-tab.component.scss']
})
export class DppTappTabComponent implements OnInit {
    titleEn: string;
    subTitle: string;
    verticalStepperForm: FormGroup;
    horizontalStepperForm: FormGroup;
    conceptUuid = this.route.snapshot.params['id'];
    constructor(private _formBuilder: FormBuilder,
                private router: Router,
                private route: ActivatedRoute,
                private objectiveAndCostService : DppObjectiveCostService,
                private _fuseTranslationLoaderService: FuseTranslationLoaderService,
                private locationHelperService: LocationHelperService,) {
        // Language translations
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);

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
            step5: this._formBuilder.group({})
        });
    }

    goBack(stepper: MatStepper): void {
        stepper.previous();
    }

    goForward(stepper: MatStepper): void {
        stepper.next();
        this.getDppMaster();
    }

    getTitleEn($event: { titleEn: string }) {
        this.titleEn = $event.titleEn;
    }

    getSubTitle($event: { subTitle: string }) {
        this.subTitle = $event.subTitle;
    }

    navigateToDppListPage() {
        this.router.navigate(['dpp-tapp']);
    }

    goBackToHome() {
        window.history.back();
    }

    selectionChanged($event: StepperSelectionEvent) {
        if ($event.selectedIndex === 1) {
            this.locationHelperService.setProjectLocationEvent();
        }
    }

    getDppMaster(){
        this.objectiveAndCostService.getByProjectConceptUuid(this.conceptUuid).subscribe((response)=>{
            let res = response.res;
        })
    }

    goToDashBoard(){
        this.router.navigate(['dpp-tapp/dashboard/' + this.conceptUuid]);
    }

}
