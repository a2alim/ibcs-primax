import { TestBed } from '@angular/core/testing';

import { RdppLogFrameService } from './rdpp-log-frame.service';

describe('RdppLogFrameService', () => {
  let service: RdppLogFrameService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RdppLogFrameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
