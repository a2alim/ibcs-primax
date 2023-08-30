import { TestBed } from '@angular/core/testing';

import { LinkupProposalWithEvaluatorsService } from './linkup-proposal-with-evaluators.service';

describe('LinkupProposalWithEvaluatorsService', () => {
  let service: LinkupProposalWithEvaluatorsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LinkupProposalWithEvaluatorsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
