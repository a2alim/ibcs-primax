import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-pm-procurement-plan',
  templateUrl: './pm-procurement-plan.component.html',
  styleUrls: ['./pm-procurement-plan.component.scss']
})
export class PmProcurementPlanComponent implements OnInit {

  horizontalStepperForm: FormGroup;
  @Input() dppTappMasterId: number;
  @Input() dppTappMasterUuid: string;
  @Input() projectConceptMasterId: number;
  @Input() projectConceptUuid: string;

  @Output() goForward = new EventEmitter<boolean>();
  @Output() goBack = new EventEmitter<boolean>();
  @Output() goBackToHome = new EventEmitter<boolean>();

  spinner: boolean;

  constructor(
    private _formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
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


  nextTab() {
    this.goForward.emit(true);
  }

  previousTab(): void {
    this.goBack.emit(true);
  }

  goToHome(): void {
    this.goBackToHome.emit(true);
  }

}
