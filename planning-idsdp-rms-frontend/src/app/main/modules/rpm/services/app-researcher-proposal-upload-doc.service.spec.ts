import { TestBed } from '@angular/core/testing';

import { AppResearcherProposalUploadDocService } from './app-researcher-proposal-upload-doc.service';

describe('AppResearcherProposalUploadDocService', () => {
  let service: AppResearcherProposalUploadDocService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppResearcherProposalUploadDocService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
