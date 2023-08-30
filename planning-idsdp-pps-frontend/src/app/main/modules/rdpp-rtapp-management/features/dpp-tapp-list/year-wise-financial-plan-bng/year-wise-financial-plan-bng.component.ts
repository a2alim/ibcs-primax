import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-year-wise-financial-plan-bng',
  templateUrl: './year-wise-financial-plan-bng.component.html',
  styleUrls: ['./year-wise-financial-plan-bng.component.scss']
})
export class YearWiseFinancialPlanBngComponent implements OnInit {
  frmGroup: FormGroup;
  horizontalStepperForm: FormGroup;
  tblRows = [
    {rows:''},
    {rows:''},
  ];

  constructor(private _formBuilder: FormBuilder) { }

  ngOnInit(): void {
  }

  goBackToHome()
  {
     window.history.back();
  }


}
