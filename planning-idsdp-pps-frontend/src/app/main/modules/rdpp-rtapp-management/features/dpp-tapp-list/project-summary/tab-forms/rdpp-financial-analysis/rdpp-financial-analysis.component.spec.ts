import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RdppFinancialAnalysisComponent } from './rdpp-financial-analysis.component';

describe('RdppFinancialAnalysisComponent', () => {
  let component: RdppFinancialAnalysisComponent;
  let fixture: ComponentFixture<RdppFinancialAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RdppFinancialAnalysisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RdppFinancialAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
