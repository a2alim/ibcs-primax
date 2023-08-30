import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstallmentPayRulesComponent } from './installment-pay-rules.component';

describe('InstallmentPayRulesComponent', () => {
  let component: InstallmentPayRulesComponent;
  let fixture: ComponentFixture<InstallmentPayRulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstallmentPayRulesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstallmentPayRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
