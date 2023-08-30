import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeasibilityStudyProposalReportComponent } from './feasibility-study-proposal-report.component';

describe('FeasibilityStudyProposalReportComponent', () => {
  let component: FeasibilityStudyProposalReportComponent;
  let fixture: ComponentFixture<FeasibilityStudyProposalReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeasibilityStudyProposalReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeasibilityStudyProposalReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
