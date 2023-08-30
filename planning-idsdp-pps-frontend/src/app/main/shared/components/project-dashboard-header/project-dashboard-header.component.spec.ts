import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectDashboardHeaderComponent } from './project-dashboard-header.component';

describe('ProjectDashboardHeaderComponent', () => {
  let component: ProjectDashboardHeaderComponent;
  let fixture: ComponentFixture<ProjectDashboardHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectDashboardHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectDashboardHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
