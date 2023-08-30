import { TestBed } from '@angular/core/testing';

import { ResearcherProposalService } from './researcher-proposal.service';

describe('ResearcherProposalService', () => {
  let service: ResearcherProposalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResearcherProposalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
