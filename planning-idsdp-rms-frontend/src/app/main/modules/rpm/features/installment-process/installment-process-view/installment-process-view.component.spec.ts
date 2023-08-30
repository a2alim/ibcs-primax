import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstallmentProcessViewComponent } from './installment-process-view.component';

describe('InstallmentProcessViewComponent', () => {
  let component: InstallmentProcessViewComponent;
  let fixture: ComponentFixture<InstallmentProcessViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstallmentProcessViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstallmentProcessViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
