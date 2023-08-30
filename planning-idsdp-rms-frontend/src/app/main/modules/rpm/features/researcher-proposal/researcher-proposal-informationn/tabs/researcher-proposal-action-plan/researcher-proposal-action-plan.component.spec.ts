import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResearcherProposalActionPlanComponent } from './researcher-proposal-action-plan.component';

describe('ResearcherProposalActionPlanComponent', () => {
  let component: ResearcherProposalActionPlanComponent;
  let fixture: ComponentFixture<ResearcherProposalActionPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResearcherProposalActionPlanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResearcherProposalActionPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
