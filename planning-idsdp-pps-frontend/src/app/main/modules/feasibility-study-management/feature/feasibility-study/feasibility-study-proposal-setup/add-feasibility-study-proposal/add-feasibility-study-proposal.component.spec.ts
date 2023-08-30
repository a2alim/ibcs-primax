import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFeasibilityStudyProposalComponent } from './add-feasibility-study-proposal.component';

describe('AddFeasibilityStudyProposalComponent', () => {
  let component: AddFeasibilityStudyProposalComponent;
  let fixture: ComponentFixture<AddFeasibilityStudyProposalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddFeasibilityStudyProposalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFeasibilityStudyProposalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
