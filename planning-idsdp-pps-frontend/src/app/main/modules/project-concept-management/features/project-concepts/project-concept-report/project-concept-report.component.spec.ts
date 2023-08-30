import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectConceptReportComponent } from './project-concept-report.component';

describe('ProjectConceptReportComponent', () => {
  let component: ProjectConceptReportComponent;
  let fixture: ComponentFixture<ProjectConceptReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectConceptReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectConceptReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
