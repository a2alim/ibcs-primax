import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectManagementSetupReportComponent } from './project-management-setup-report.component';

describe('ProjectManagementSetupReportComponent', () => {
  let component: ProjectManagementSetupReportComponent;
  let fixture: ComponentFixture<ProjectManagementSetupReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectManagementSetupReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectManagementSetupReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
