import { TestBed } from '@angular/core/testing';

import { UtilityFunctionsService } from './utility-functions.service';

describe('UtilityFunctionsService', () => {
  let service: UtilityFunctionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UtilityFunctionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
