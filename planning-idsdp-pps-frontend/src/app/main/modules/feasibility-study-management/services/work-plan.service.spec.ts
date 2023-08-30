import { TestBed } from '@angular/core/testing';

import { WorkPlanService } from './work-plan.service';

describe('WorkPlanService', () => {
  let service: WorkPlanService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkPlanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
