import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeasibilityStudyProposalEditDashboardComponent } from './feasibility-study-proposal-edit-dashboard.component';

describe('FeasibilityStudyProposalEditDashboardComponent', () => {
  let component: FeasibilityStudyProposalEditDashboardComponent;
  let fixture: ComponentFixture<FeasibilityStudyProposalEditDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeasibilityStudyProposalEditDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeasibilityStudyProposalEditDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
