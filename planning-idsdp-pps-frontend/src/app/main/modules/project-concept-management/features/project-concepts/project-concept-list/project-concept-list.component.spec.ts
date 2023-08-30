import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ProjectConceptListComponent} from './project-concept-list.component';

describe('ProjectConceptListComponent', () => {
  let component: ProjectConceptListComponent;
  let fixture: ComponentFixture<ProjectConceptListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectConceptListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectConceptListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
