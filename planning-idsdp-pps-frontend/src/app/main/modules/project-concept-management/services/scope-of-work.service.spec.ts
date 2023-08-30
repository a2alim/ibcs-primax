import { TestBed } from '@angular/core/testing';

import { ScopeOfWorkService } from './scope-of-work.service';

describe('ScopeOfWorkService', () => {
  let service: ScopeOfWorkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScopeOfWorkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
