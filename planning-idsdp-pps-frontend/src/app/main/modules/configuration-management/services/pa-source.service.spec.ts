import { TestBed } from '@angular/core/testing';

import { PaSourceService } from './pa-source.service';

describe('PaSourceService', () => {
  let service: PaSourceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaSourceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
