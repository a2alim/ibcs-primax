import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalEvaluationReportListComponent } from './final-evaluation-report-list.component';

describe('FinalEvaluationReportListComponent', () => {
  let component: FinalEvaluationReportListComponent;
  let fixture: ComponentFixture<FinalEvaluationReportListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinalEvaluationReportListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FinalEvaluationReportListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
