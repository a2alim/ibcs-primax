import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectConceptViewDashboardComponent } from './project-concept-view-dashboard.component';

describe('ProjectConceptViewDashboardComponent', () => {
  let component: ProjectConceptViewDashboardComponent;
  let fixture: ComponentFixture<ProjectConceptViewDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectConceptViewDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectConceptViewDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
