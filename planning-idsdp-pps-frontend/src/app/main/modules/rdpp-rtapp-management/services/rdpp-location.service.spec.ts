import { TestBed } from '@angular/core/testing';

import { RdppLocationService } from './rdpp-location.service';

describe('RdppLocationService', () => {
  let service: RdppLocationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RdppLocationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
