import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YearWiseFinancialPlanComponent } from './year-wise-financial-plan.component';

describe('YearWiseFinancialPlanComponent', () => {
  let component: YearWiseFinancialPlanComponent;
  let fixture: ComponentFixture<YearWiseFinancialPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YearWiseFinancialPlanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(YearWiseFinancialPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
