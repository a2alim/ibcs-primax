import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjecFeasibilityStudyReportComponent } from './projec-feasibility-study-report.component';

describe('ProjecFeasibilityStudyReportComponent', () => {
  let component: ProjecFeasibilityStudyReportComponent;
  let fixture: ComponentFixture<ProjecFeasibilityStudyReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjecFeasibilityStudyReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjecFeasibilityStudyReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
