import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EligibilityCheckerComponent } from './eligibility-checker.component';

describe('EligibilityCheckerComponent', () => {
  let component: EligibilityCheckerComponent;
  let fixture: ComponentFixture<EligibilityCheckerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EligibilityCheckerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EligibilityCheckerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
