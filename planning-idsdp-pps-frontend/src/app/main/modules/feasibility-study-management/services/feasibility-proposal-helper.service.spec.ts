import { TestBed } from '@angular/core/testing';

import { FeasibilityProposalHelperService } from './feasibility-proposal-helper.service';

describe('FeasibilityProposalHelperService', () => {
  let service: FeasibilityProposalHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FeasibilityProposalHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
