import { TestBed } from '@angular/core/testing';

import { PmVisitScheduleService } from './pm-visit-schedule.service';

describe('PmVisitScheduleService', () => {
  let service: PmVisitScheduleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PmVisitScheduleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
