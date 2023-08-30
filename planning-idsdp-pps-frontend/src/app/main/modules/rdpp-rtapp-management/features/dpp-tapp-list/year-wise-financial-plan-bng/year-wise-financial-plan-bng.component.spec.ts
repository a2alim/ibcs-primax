import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YearWiseFinancialPlanBngComponent } from './year-wise-financial-plan-bng.component';

describe('YearWiseFinancialPlanBngComponent', () => {
  let component: YearWiseFinancialPlanBngComponent;
  let fixture: ComponentFixture<YearWiseFinancialPlanBngComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YearWiseFinancialPlanBngComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(YearWiseFinancialPlanBngComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
