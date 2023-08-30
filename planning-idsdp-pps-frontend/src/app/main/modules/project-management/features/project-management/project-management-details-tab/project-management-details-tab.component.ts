import { Component, createPlatform, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackbarHelper } from 'app/main/core/helper/snackbar.helper';
import { FuseTranslationLoaderService } from 'app/main/core/services/translation-loader.service';
import { DppObjectiveCostService } from 'app/main/modules/dpp-tapp-management/services/dpp-objective-cost.service';
/*----Lng Translation----*/
import { locale as lngEnglish } from './i18n/en';
import { locale as lngBangla } from './i18n/bn';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-project-management-details-tab',
  templateUrl: './project-management-details-tab.component.html',
  styleUrls: ['./project-management-details-tab.component.scss']
})
export class ProjectManagementDetailsTabComponent implements OnInit {

  dppTappMasterId: number;
  dppTappMasterUuid: string;
  projectConceptMasterId: number;
  projectConceptUuid: string;
  type: string;
 // pcmId: string;
  dateCommencement: Date;
  dateCompletion: Date;
  horizontalStepperForm: FormGroup;

  constructor(
    private _formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService
  ) {
    // Language translations
    this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
  }

  ngOnInit(): void {
    this.dppTappMasterId = this.route.snapshot.params['dppTappMasterId'];
    this.dppTappMasterUuid = this.route.snapshot.params['dppTappMasterUuid'];
    this.type = this.route.snapshot.params['type'];
    //this.pcmId = this.route.snapshot.params['pcmId'];
    this.projectConceptMasterId = this.route.snapshot.params['projectConceptMasterId'];
    this.projectConceptUuid = this.route.snapshot.params['projectConceptUuid'];
    this.dateCommencement = this.route.snapshot.params['dateCommencement'];
    this.dateCompletion = this.route.snapshot.params['dateCompletion'];
    this.createPlatform();
  }

  createPlatform() {
    this.horizontalStepperForm = this._formBuilder.group({
      step1: this._formBuilder.group({}),
      step2: this._formBuilder.group({}),
      step3: this._formBuilder.group({}),
      step4: this._formBuilder.group({}),
      step5: this._formBuilder.group({}),
      step6: this._formBuilder.group({}),
      step7: this._formBuilder.group({}),
      step8: this._formBuilder.group({})
    });
  }

  goForward(stepper: MatStepper): void {
    stepper.next();
  }

  goBack(stepper: MatStepper): void {
    stepper.previous();
  }

  goBackToHome() {
    window.history.back();
  }


}
