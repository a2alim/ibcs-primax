import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitBillVoucherNewTwoComponent } from './submit-bill-voucher-new-two.component';

describe('SubmitBillVoucherNewTwoComponent', () => {
  let component: SubmitBillVoucherNewTwoComponent;
  let fixture: ComponentFixture<SubmitBillVoucherNewTwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubmitBillVoucherNewTwoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitBillVoucherNewTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
