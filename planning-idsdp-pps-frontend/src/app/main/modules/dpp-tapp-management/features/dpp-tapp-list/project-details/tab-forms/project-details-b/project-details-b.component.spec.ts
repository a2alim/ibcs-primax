import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectDetailsBComponent } from './project-details-b.component';

describe('ProjectDetailsBComponent', () => {
  let component: ProjectDetailsBComponent;
  let fixture: ComponentFixture<ProjectDetailsBComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectDetailsBComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectDetailsBComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
