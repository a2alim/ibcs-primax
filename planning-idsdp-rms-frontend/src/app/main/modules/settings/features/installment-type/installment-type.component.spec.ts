import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstallmentTypeComponent } from './installment-type.component';

describe('InstallmentTypeComponent', () => {
  let component: InstallmentTypeComponent;
  let fixture: ComponentFixture<InstallmentTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstallmentTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstallmentTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
