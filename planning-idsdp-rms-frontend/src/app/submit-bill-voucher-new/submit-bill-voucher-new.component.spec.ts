import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitBillVoucherNewComponent } from './submit-bill-voucher-new.component';

describe('SubmitBillVoucherNewComponent', () => {
  let component: SubmitBillVoucherNewComponent;
  let fixture: ComponentFixture<SubmitBillVoucherNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubmitBillVoucherNewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitBillVoucherNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
