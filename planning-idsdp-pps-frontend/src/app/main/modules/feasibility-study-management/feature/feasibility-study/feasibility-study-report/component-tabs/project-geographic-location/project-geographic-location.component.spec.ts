import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectGeographicLocationComponent } from './project-geographic-location.component';

describe('ProjectGeographicLocationComponent', () => {
  let component: ProjectGeographicLocationComponent;
  let fixture: ComponentFixture<ProjectGeographicLocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectGeographicLocationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectGeographicLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
