import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstallmentProcessComponent } from './installment-process.component';

describe('InstallmentProcessComponent', () => {
  let component: InstallmentProcessComponent;
  let fixture: ComponentFixture<InstallmentProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstallmentProcessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstallmentProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
