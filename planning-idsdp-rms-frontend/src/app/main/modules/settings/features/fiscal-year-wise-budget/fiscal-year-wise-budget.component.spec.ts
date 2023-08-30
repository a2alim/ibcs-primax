import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiscalYearWiseBudgetComponent } from './fiscal-year-wise-budget.component';

describe('FiscalYearWiseBudgetComponent', () => {
  let component: FiscalYearWiseBudgetComponent;
  let fixture: ComponentFixture<FiscalYearWiseBudgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FiscalYearWiseBudgetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FiscalYearWiseBudgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
