import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectLocationCommonComponent } from './project-location-common.component';

describe('ProjectLocationCommonComponent', () => {
  let component: ProjectLocationCommonComponent;
  let fixture: ComponentFixture<ProjectLocationCommonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectLocationCommonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectLocationCommonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
