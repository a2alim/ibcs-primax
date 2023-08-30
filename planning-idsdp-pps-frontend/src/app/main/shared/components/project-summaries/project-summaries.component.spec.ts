import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectSummariesComponent } from './project-summaries.component';

describe('ProjectSummariesComponent', () => {
  let component: ProjectSummariesComponent;
  let fixture: ComponentFixture<ProjectSummariesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectSummariesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectSummariesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
