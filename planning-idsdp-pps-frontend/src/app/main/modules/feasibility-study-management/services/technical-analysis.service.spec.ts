import { TestBed } from '@angular/core/testing';

import { TechnicalAnalysisService } from './technical-analysis.service';

describe('TechnicalAnalysisService', () => {
  let service: TechnicalAnalysisService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TechnicalAnalysisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
