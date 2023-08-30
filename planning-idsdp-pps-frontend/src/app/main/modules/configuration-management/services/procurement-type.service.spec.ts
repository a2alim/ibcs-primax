import { TestBed } from '@angular/core/testing';

import { ProcurementTypeService } from './procurement-type.service';

describe('ProcurementTypeService', () => {
  let service: ProcurementTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProcurementTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
