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
import {ProjectSummaryService} from "../../../../../project-concept-management/services/project-summary.service";
import {TranslateService} from "@ngx-translate/core";
import { LayoutHelperService } from 'app/layout/layouts/vertical/services/layout-helper.service';
import {SUCCESSFULLY_SAVE, SUCCESSFULLY_SAVE_BN} from "../../../../../../core/constants/message";
import {SnackbarHelper} from "../../../../../../core/helper/snackbar.helper";

/*----/Lng Translation----*/

@Component({
    selector: 'app-dpp-tapp-tab',
    templateUrl: './dpp-tapp-tab.component.html',
    styleUrls: ['./dpp-tapp-tab.component.scss']
})
export class DppTappTabComponent implements OnInit {
    verticalStepperForm: FormGroup;
    horizontalStepperForm: FormGroup;
    conceptUuid = this.route.snapshot.params['id'];
    isForeignAid: any;
    titleEn: any;

    constructor(private _formBuilder: FormBuilder,
                private router: Router,
                private route: ActivatedRoute,
                private objectiveAndCostService : DppObjectiveCostService,
                private _fuseTranslationLoaderService: FuseTranslationLoaderService,
                private projectSummaryService: ProjectSummaryService,
                private _translateService: TranslateService,
                private locationHelperService: LocationHelperService,
                private layoutHelperService: LayoutHelperService,
                private snackbarHelper: SnackbarHelper) {
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
        this.getProjectSummary();
        // Horizontal stepper form
        this.horizontalStepperForm = this._formBuilder.group({
            step1: this._formBuilder.group({}),
            step2: this._formBuilder.group({}),
            step3: this._formBuilder.group({}),
            step4: this._formBuilder.group({}),
            step5: this._formBuilder.group({})
        });
    }

    /*-----------Get project summary --------*/
    getProjectSummary() {
        this.projectSummaryService.getByUuid(this.conceptUuid).subscribe(res => {
            this.isForeignAid = res.isForeignAid;
            this.titleEn = res.titleEn;
            if (this.isForeignAid) {
                this._translateService.use('en');
                this.layoutHelperService.changeNavLanguage('en');
            } else {
                this._translateService.use('bn');
                this.layoutHelperService.changeNavLanguage('bn');
            }
        })
    }

    goBack(stepper: MatStepper): void {
        stepper.previous();
    }

    goForward(stepper: MatStepper): void {
        stepper.next();
        this.getDppMaster();
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
