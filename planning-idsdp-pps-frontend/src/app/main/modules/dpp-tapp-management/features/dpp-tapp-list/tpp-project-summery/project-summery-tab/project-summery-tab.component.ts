import { Component, Input, OnInit, Output } from '@angular/core';
/*----Lng Translation----*/
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { locale as lngEnglish } from './i18n/en';
import { locale as lngBangla } from './i18n/bn';
import { FuseTranslationLoaderService } from '../../../../../../core/services/translation-loader.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from "@angular/router";
import { MatStepper } from "@angular/material/stepper";
import { LocationHelperService } from 'app/main/shared/services/location-helper.service';
import { ProjectSummaryService } from 'app/main/modules/project-concept-management/services/project-summary.service';
import { TranslateService } from '@ngx-translate/core';
import { LayoutHelperService } from 'app/layout/layouts/vertical/services/layout-helper.service';

/*----/Lng Translation----*/
@Component({
    selector: 'app-project-summery-tab',
    templateUrl: './project-summery-tab.component.html',
    styleUrls: ['./project-summery-tab.component.scss']
})
export class ProjectSummeryTabComponent implements OnInit {

    titleEn: string;
    titleBn: string;
    horizontalStepperForm: FormGroup;
    conceptUuid = this.route.snapshot.params['id'];
    isForeignAid: any;
    isParipatra2016: false;

    constructor(private _formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private projectSummaryService: ProjectSummaryService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _translateService: TranslateService,
        private layoutHelperService: LayoutHelperService,
        private locationHelperService: LocationHelperService) {
        // Language translations
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

        this.getProjectSummary();
    }

    getProjectSummary() {
        this.projectSummaryService.getByUuid(this.conceptUuid).subscribe(res => {
            this.isForeignAid = res.isForeignAid;
            this.titleEn = res.titleEn;
            this.titleBn = res.titleBn;
            this.isParipatra2016 = res.isParipatra2016;

            if (this.isForeignAid) {
                this._translateService.use('en');
                this.layoutHelperService.changeNavLanguage('en');
            } else {
                this._translateService.use('bn');
                this.layoutHelperService.changeNavLanguage('bn');
            }
        })
    }


    getTitleEn($event: { titleEn: string }) {
        // this.titleEn = $event.titleEn;
    }

    goBack(stepper: MatStepper): void {
        stepper.previous();
    }

    goForward(stepper: MatStepper): void {
        stepper.next();
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
}
