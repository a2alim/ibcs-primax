import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartialAndFinalPaymentListTwoComponent } from './partial-and-final-payment-list-two.component';

describe('PartialAndFinalPaymentListTwoComponent', () => {
  let component: PartialAndFinalPaymentListTwoComponent;
  let fixture: ComponentFixture<PartialAndFinalPaymentListTwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartialAndFinalPaymentListTwoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PartialAndFinalPaymentListTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
