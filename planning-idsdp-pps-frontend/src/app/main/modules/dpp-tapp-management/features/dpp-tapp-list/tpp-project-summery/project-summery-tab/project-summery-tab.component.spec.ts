import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectSummeryTabComponent } from './project-summery-tab.component';

describe('ProjectSummeryTabComponent', () => {
  let component: ProjectSummeryTabComponent;
  let fixture: ComponentFixture<ProjectSummeryTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectSummeryTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectSummeryTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
