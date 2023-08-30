import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFeasibilityStudyReportComponent } from './add-feasibility-study-report.component';

describe('AddProjectConceptComponent', () => {
  let component: AddFeasibilityStudyReportComponent;
  let fixture: ComponentFixture<AddFeasibilityStudyReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddFeasibilityStudyReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFeasibilityStudyReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
