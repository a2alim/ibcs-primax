import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadBillVoucherComponent } from './upload-bill-voucher.component';

describe('UploadBillVoucherComponent', () => {
  let component: UploadBillVoucherComponent;
  let fixture: ComponentFixture<UploadBillVoucherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadBillVoucherComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadBillVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
