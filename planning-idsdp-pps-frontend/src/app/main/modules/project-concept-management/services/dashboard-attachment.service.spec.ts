import { TestBed } from '@angular/core/testing';

import { DashboardAttachmentService } from './dashboard-attachment.service';

describe('DashboardAttachmentService', () => {
  let service: DashboardAttachmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DashboardAttachmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
