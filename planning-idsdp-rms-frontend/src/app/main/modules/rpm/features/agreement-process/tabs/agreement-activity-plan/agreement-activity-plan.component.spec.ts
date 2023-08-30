import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgreementActivityPlanComponent } from './agreement-activity-plan.component';

describe('AgreementActivityPlanComponent', () => {
  let component: AgreementActivityPlanComponent;
  let fixture: ComponentFixture<AgreementActivityPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgreementActivityPlanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgreementActivityPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
