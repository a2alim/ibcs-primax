import { TestBed } from '@angular/core/testing';

import { ProjectMovementService } from './project-movement.service';

describe('ProjectMovementService', () => {
  let service: ProjectMovementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectMovementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
