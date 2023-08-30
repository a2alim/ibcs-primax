import { TestBed } from '@angular/core/testing';

import { CostBenefitAnalysisService } from './cost-benefit-analysis.service';

describe('CostBenefitAnalysisService', () => {
  let service: CostBenefitAnalysisService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CostBenefitAnalysisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
