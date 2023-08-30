import { TestBed } from '@angular/core/testing';

import { GlobalValidationService } from './global-validation.service';

describe('GlobalValidationService', () => {
  let service: GlobalValidationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlobalValidationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
