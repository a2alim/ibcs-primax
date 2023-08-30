import { TestBed } from '@angular/core/testing';

import { ResearcherProposalInstituteInfoService } from './researcher-proposal-institute-info.service';

describe('ResearcherProposalInstituteInfoService', () => {
  let service: ResearcherProposalInstituteInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResearcherProposalInstituteInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
