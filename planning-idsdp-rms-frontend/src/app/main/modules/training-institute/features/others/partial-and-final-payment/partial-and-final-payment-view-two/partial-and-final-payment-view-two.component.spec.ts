import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartialAndFinalPaymentViewTwoComponent } from './partial-and-final-payment-view-two.component';

describe('PartialAndFinalPaymentViewTwoComponent', () => {
  let component: PartialAndFinalPaymentViewTwoComponent;
  let fixture: ComponentFixture<PartialAndFinalPaymentViewTwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartialAndFinalPaymentViewTwoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PartialAndFinalPaymentViewTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
