import { TestBed } from '@angular/core/testing';

import { ExpenditureCostService } from './expenditure-cost.service';

describe('ExpenditureCostService', () => {
  let service: ExpenditureCostService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExpenditureCostService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
