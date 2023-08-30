import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MatStepper} from '@angular/material/stepper';
import {ActivatedRoute, Router} from '@angular/router';
import {locale as lngEnglish} from './i18n/en';
import {locale as lngBangla} from './i18n/bn';
import {FuseTranslationLoaderService} from '../../../../../../core/services/translation-loader.service';
import {ProjectConceptService} from '../../../../services/project-concept.service';
import {ProjectSummaryService} from '../../../../services/project-summary.service';
import {StepperSelectionEvent} from '@angular/cdk/stepper';
import {LocationHelperService} from '../../../../../../shared/services/location-helper.service';
import { LayoutHelperService } from 'app/layout/layouts/vertical/services/layout-helper.service';

@Component({
    selector: 'app-add-project-concept',
    templateUrl: './add-project-concept.component.html',
    styleUrls: ['./add-project-concept.component.scss']
})
export class AddProjectConceptComponent implements OnInit {

    horizontalStepperForm: FormGroup;
    projectConceptMasterId: number;
    canEdit: boolean;

    constructor(private _formBuilder: FormBuilder, private router: Router,
                private fuseTranslationLoaderService: FuseTranslationLoaderService,
                private projectConceptService: ProjectConceptService,
                private projectSummaryService: ProjectSummaryService,
                private locationHelperService: LocationHelperService,
                private _activatedRoute: ActivatedRoute,
                private layoutHelperService: LayoutHelperService) {
        this.fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }


    ngOnInit(): void {
        // Horizontal stepper form
        // this.projectConceptMasterId = Number(this._activatedRoute.snapshot.paramMap.get('uuid'));
        // this.projectConceptService.projectSummaryCreateId = this.projectConceptMasterId;
        this.layoutHelperService.changeNavLanguage('en');
        if (this._activatedRoute.snapshot.paramMap.get('uuid') && this._activatedRoute.snapshot.paramMap.get('edit')) {
            this.projectSummaryService.getByUuid(this._activatedRoute.snapshot.paramMap.get('uuid')).subscribe(res => {
                this.projectConceptMasterId = res.id;
                this.canEdit = this._activatedRoute.snapshot.paramMap.get('edit') === 'true';
                this.projectConceptService.projectSummaryCreateId = res.id;
                this.popoulateMatForm();
            });
        } else {
            this.canEdit = true;
            this.popoulateMatForm();
        }
    }

    private popoulateMatForm() {
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

    goForward(stepper: MatStepper, step?: number): void {
        stepper.next();
    }

    save(): any {
        this.router.navigate(['project-concept']);
        this.projectConceptService.projectSummaryCreateId = 0;
    }

    getProjectSummaryId($event: number) {
        this.projectConceptMasterId = $event;
    }

    navigateToList() {
        this.router.navigate(['project-concept']);
    }

    navigateToDashboard() {
        this.router.navigate(['project-concept/edit-dashboard/' + this._activatedRoute.snapshot.paramMap.get('uuid')]);
    }

    selectionChanged($event: StepperSelectionEvent) {
        if ($event.selectedIndex === 1) {
            this.locationHelperService.setProjectLocationEvent();
        }
        $event.selectedStep.interacted = false;
    }

    // stepChanged(event: StepperSelectionEvent) {
    //     event.selectedStep.interacted = false;
    // }
}
