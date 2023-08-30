import { TestBed } from '@angular/core/testing';

import { LinkagesAndTargetService } from './linkages-and-target.service';

describe('LinkagesAndTargetService', () => {
  let service: LinkagesAndTargetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LinkagesAndTargetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
