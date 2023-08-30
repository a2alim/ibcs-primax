import { TestBed } from '@angular/core/testing';

import { MarketAnalysisService } from './market-analysis.service';

describe('MarketAnalysisService', () => {
  let service: MarketAnalysisService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MarketAnalysisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
