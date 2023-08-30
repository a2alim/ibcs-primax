import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectManagementDetailsTabComponent } from './project-management-details-tab.component';

describe('ProjectManagementDetailsTabComponent', () => {
  let component: ProjectManagementDetailsTabComponent;
  let fixture: ComponentFixture<ProjectManagementDetailsTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectManagementDetailsTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectManagementDetailsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
