import { TestBed } from '@angular/core/testing';

import { FeasibilityStudySummaryService } from './feasibility-study-summary.service';

describe('FeasibilityStudySummaryService', () => {
  let service: FeasibilityStudySummaryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FeasibilityStudySummaryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
