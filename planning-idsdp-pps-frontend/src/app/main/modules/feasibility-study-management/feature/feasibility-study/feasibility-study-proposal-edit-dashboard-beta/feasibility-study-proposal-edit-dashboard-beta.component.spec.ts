import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeasibilityStudyProposalEditDashboardBetaComponent } from './feasibility-study-proposal-edit-dashboard-beta.component';

describe('FeasibilityStudyProposalEditDashboardBetaComponent', () => {
  let component: FeasibilityStudyProposalEditDashboardBetaComponent;
  let fixture: ComponentFixture<FeasibilityStudyProposalEditDashboardBetaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeasibilityStudyProposalEditDashboardBetaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeasibilityStudyProposalEditDashboardBetaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
