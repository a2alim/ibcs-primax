import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResearcherProposalBudgetDetailsComponent } from './researcher-proposal-budget-details.component';

describe('ResearcherProposalBudgetDetailsComponent', () => {
  let component: ResearcherProposalBudgetDetailsComponent;
  let fixture: ComponentFixture<ResearcherProposalBudgetDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResearcherProposalBudgetDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResearcherProposalBudgetDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
