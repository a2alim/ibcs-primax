import { TestBed } from '@angular/core/testing';

import { SectorDivisionService } from './sector-division.service';

describe('SectorDivisionService', () => {
  let service: SectorDivisionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SectorDivisionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
