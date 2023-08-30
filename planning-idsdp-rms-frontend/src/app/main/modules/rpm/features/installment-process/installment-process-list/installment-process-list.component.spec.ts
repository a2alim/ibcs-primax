import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstallmentProcessListComponent } from './installment-process-list.component';

describe('InstallmentProcessListComponent', () => {
  let component: InstallmentProcessListComponent;
  let fixture: ComponentFixture<InstallmentProcessListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstallmentProcessListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstallmentProcessListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
