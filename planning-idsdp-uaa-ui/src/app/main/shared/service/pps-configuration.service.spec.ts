import { TestBed } from '@angular/core/testing';

import { PpsConfigurationService } from './pps-configuration.service';

describe('PpsConfigurationService', () => {
  let service: PpsConfigurationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PpsConfigurationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
