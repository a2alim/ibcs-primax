import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeasibilityStudyProposalViewDashboardComponent } from './feasibility-study-proposal-view-dashboard.component';

describe('FeasibilityStudyProposalViewDashboardComponent', () => {
  let component: FeasibilityStudyProposalViewDashboardComponent;
  let fixture: ComponentFixture<FeasibilityStudyProposalViewDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeasibilityStudyProposalViewDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeasibilityStudyProposalViewDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
