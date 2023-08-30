import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectConceptEditDashboardComponent } from './project-concept-edit-dashboard.component';

describe('ProjectConceptEditDashboardComponent', () => {
  let component: ProjectConceptEditDashboardComponent;
  let fixture: ComponentFixture<ProjectConceptEditDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectConceptEditDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectConceptEditDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
