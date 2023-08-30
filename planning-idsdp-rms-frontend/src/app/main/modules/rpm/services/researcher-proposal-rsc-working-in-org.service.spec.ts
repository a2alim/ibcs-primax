import { TestBed } from '@angular/core/testing';

import { ResearcherProposalRscWorkingInOrgService } from './researcher-proposal-rsc-working-in-org.service';

describe('ResearcherProposalRscWorkingInOrgService', () => {
  let service: ResearcherProposalRscWorkingInOrgService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResearcherProposalRscWorkingInOrgService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
