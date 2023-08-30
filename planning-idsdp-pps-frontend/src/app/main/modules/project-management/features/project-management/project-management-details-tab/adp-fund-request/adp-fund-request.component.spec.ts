import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdpFundRequestComponent } from './adp-fund-request.component';

describe('AdpFundRequestComponent', () => {
  let component: AdpFundRequestComponent;
  let fixture: ComponentFixture<AdpFundRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdpFundRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdpFundRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
