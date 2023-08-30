import { TestBed } from '@angular/core/testing';

import { FeasibilityStudyProposalSummaryService } from './feasibility-study-proposal-summary.service';

describe('FeasibilityStudyProposalSummaryService', () => {
  let service: FeasibilityStudyProposalSummaryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FeasibilityStudyProposalSummaryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
