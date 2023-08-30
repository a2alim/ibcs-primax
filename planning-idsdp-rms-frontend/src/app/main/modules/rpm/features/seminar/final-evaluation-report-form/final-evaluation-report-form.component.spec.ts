import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalEvaluationReportFormComponent } from './final-evaluation-report-form.component';

describe('FinalEvaluationReportFormComponent', () => {
  let component: FinalEvaluationReportFormComponent;
  let fixture: ComponentFixture<FinalEvaluationReportFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinalEvaluationReportFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FinalEvaluationReportFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
