import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectMovementComponent } from './project-movement.component';

describe('ProjectMovementComponent', () => {
  let component: ProjectMovementComponent;
  let fixture: ComponentFixture<ProjectMovementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectMovementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectMovementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
