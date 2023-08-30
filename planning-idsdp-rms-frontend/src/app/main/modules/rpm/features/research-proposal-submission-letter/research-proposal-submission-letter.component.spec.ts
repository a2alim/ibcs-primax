import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResearchProposalSubmissionLetterComponent } from './research-proposal-submission-letter.component';

describe('ResearchProposalSubmissionLetterComponent', () => {
  let component: ResearchProposalSubmissionLetterComponent;
  let fixture: ComponentFixture<ResearchProposalSubmissionLetterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResearchProposalSubmissionLetterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResearchProposalSubmissionLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
