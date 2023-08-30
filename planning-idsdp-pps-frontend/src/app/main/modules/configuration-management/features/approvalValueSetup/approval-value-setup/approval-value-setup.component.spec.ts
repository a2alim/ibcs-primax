import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalValueSetupComponent } from './approval-value-setup.component';

describe('ApprovalValueSetupComponent', () => {
  let component: ApprovalValueSetupComponent;
  let fixture: ComponentFixture<ApprovalValueSetupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprovalValueSetupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovalValueSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
