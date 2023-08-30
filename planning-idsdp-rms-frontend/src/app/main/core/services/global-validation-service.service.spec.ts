import { TestBed } from '@angular/core/testing';

import { GlobalValidationServiceService } from './global-validation-service.service';

describe('GlobalValidationServiceService', () => {
  let service: GlobalValidationServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlobalValidationServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
