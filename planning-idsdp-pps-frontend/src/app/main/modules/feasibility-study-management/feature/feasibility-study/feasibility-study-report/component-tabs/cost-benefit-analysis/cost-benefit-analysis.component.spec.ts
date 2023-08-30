import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CostBenefitAnalysisComponent } from './cost-benefit-analysis.component';

describe('CostBenefitAnalysisComponent', () => {
  let component: CostBenefitAnalysisComponent;
  let fixture: ComponentFixture<CostBenefitAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CostBenefitAnalysisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CostBenefitAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
