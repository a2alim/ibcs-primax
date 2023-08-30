import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketDemandAnalysisComponent } from './market-demand-analysis.component';

describe('MarketDemandAnalysisComponent', () => {
  let component: MarketDemandAnalysisComponent;
  let fixture: ComponentFixture<MarketDemandAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarketDemandAnalysisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketDemandAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
