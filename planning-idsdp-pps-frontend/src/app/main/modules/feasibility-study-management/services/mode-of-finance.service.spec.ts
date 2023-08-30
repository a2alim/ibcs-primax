import { TestBed } from '@angular/core/testing';

import { ModeOfFinanceService } from './mode-of-finance.service';

describe('ModeOfFinanceService', () => {
  let service: ModeOfFinanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModeOfFinanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
