import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgreementInstallmentTabComponent } from './agreement-installment-tab.component';

describe('AgreementInstallmentTabComponent', () => {
  let component: AgreementInstallmentTabComponent;
  let fixture: ComponentFixture<AgreementInstallmentTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgreementInstallmentTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgreementInstallmentTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
