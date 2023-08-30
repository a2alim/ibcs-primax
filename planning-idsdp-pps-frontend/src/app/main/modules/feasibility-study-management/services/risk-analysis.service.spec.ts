import { TestBed } from '@angular/core/testing';

import { RiskAnalysisService } from './risk-analysis.service';

describe('RiskAnalysisService', () => {
  let service: RiskAnalysisService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RiskAnalysisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
