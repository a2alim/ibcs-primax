import { TestBed } from '@angular/core/testing';

import { ProcurementMethodService } from './procurement-method.service';

describe('ProcurementMethodService', () => {
  let service: ProcurementMethodService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProcurementMethodService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
