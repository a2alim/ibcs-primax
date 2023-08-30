import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialAnalysisCalModalComponent } from './financial-analysis-cal-modal.component';

describe('FinancialAnalysisCalModalComponent', () => {
  let component: FinancialAnalysisCalModalComponent;
  let fixture: ComponentFixture<FinancialAnalysisCalModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinancialAnalysisCalModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FinancialAnalysisCalModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
