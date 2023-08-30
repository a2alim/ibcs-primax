import { TestBed } from '@angular/core/testing';

import { OtherAnalysisService } from './other-analysis.service';

describe('OtherAnalysisService', () => {
  let service: OtherAnalysisService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OtherAnalysisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
