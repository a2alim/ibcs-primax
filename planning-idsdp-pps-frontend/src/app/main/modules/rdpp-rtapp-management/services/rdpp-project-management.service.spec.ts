import { TestBed } from '@angular/core/testing';

import { RdppProjectManagementService } from './rdpp-project-management.service';

describe('RdppProjectManagementService', () => {
  let service: RdppProjectManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RdppProjectManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
