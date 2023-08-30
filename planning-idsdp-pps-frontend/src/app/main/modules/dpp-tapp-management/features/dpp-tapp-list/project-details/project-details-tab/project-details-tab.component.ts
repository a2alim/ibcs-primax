import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
/*----Lng Translation----*/
import {locale as lngEnglish} from './i18n/en';
import {locale as lngBangla} from './i18n/bn';
import {FuseTranslationLoaderService} from '../../../../../../core/services/translation-loader.service';
import {MatStepper} from '@angular/material/stepper';
import {ActivatedRoute, Router} from "@angular/router";
import {DppObjectiveCostService} from "../../../../services/dpp-objective-cost.service";
import {error} from "selenium-webdriver";
import {SnackbarHelper} from "../../../../../../core/helper/snackbar.helper";
import {DppAnnualPhasingCostTabDetailsService} from '../../../../services/dpp-annual-phasing-cost-tab-details.service';
import {ProjectSummaryService} from "../../../../../project-concept-management/services/project-summary.service";
import {TranslateService} from "@ngx-translate/core";

/*----/Lng Translation----*/
@Component({
    selector: 'app-project-details-tab',
    templateUrl: './project-details-tab.component.html',
    styleUrls: ['./project-details-tab.component.scss']
})
export class ProjectDetailsTabComponent implements OnInit {
    conceptUuid = this.route.snapshot.params['id'];
    horizontalStepperForm: FormGroup;
    tabEnable: boolean;
    dppMasterUuid;
    titleEn: any;
    isParipatra2016: boolean;

    constructor(private _formBuilder: FormBuilder,
                private router: Router,
                private route: ActivatedRoute,
                private sanckbar : SnackbarHelper,
                private objectiveAndCostService : DppObjectiveCostService,
                private projectSummaryService: ProjectSummaryService,
                private _translateService: TranslateService,
                private _fuseTranslationLoaderService: FuseTranslationLoaderService) {
        // Language translations
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
        this.getProjectSummary();
    }

    ngOnInit(): void {
        this.getDppMasterUuid()
        this.horizontalStepperForm = this._formBuilder.group({
            step1: this._formBuilder.group({}),
            step2: this._formBuilder.group({}),
            step3: this._formBuilder.group({}),
            step4: this._formBuilder.group({}),
            step5: this._formBuilder.group({}),
            step6: this._formBuilder.group({}),
            step7: this._formBuilder.group({})
        });
    }

    getProjectSummary() {
        this.projectSummaryService.getByUuid(this.conceptUuid).subscribe(res => {
            this.titleEn = res.titleEn;
            this.isParipatra2016 = res.isParipatra2016;
            if (res.isForeignAid) {
                this._translateService.use('en');
            } else {
                this._translateService.use('bn');
            }
        })
    }

    goForward(stepper: MatStepper): void {
        stepper.next();
    }

    goBack(stepper: MatStepper): void {
        stepper.previous();
    }

    navigateToDppListPage() {
        this.router.navigate(['dpp-tapp']);
    }

    goBackToHome() {
        window.history.back();
    }

    getDppMasterUuid(){
        this.objectiveAndCostService.getByProjectConceptUuid(this.conceptUuid).subscribe((response)=>{
            let res = response.res;
            this.dppMasterUuid = res.uuid;
            if(res.uuid != null){
                this.tabEnable= false;
            }else {

                this.tabEnable = true;
            }
        })
    }

}
