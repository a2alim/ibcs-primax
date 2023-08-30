import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeasibilityStudySummaryComponent } from './feasibility-study-summary.component';

describe('FeasibilityStudySummaryComponent', () => {
  let component: FeasibilityStudySummaryComponent;
  let fixture: ComponentFixture<FeasibilityStudySummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeasibilityStudySummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeasibilityStudySummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
