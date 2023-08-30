import { TestBed } from '@angular/core/testing';

import { ProjectLocationService } from './project-location.service';

describe('ProjectLocationService', () => {
  let service: ProjectLocationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectLocationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
