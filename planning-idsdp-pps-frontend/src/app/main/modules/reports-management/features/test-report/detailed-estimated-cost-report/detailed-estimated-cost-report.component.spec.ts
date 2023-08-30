import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedEstimatedCostReportComponent } from './detailed-estimated-cost-report.component';

describe('DetailedEstimatedCostReportComponent', () => {
  let component: DetailedEstimatedCostReportComponent;
  let fixture: ComponentFixture<DetailedEstimatedCostReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailedEstimatedCostReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailedEstimatedCostReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
