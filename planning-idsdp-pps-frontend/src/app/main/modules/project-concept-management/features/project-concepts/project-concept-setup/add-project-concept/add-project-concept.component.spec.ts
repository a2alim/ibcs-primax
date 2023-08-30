import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProjectConceptComponent } from './add-project-concept.component';

describe('AddProjectConceptComponent', () => {
  let component: AddProjectConceptComponent;
  let fixture: ComponentFixture<AddProjectConceptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddProjectConceptComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProjectConceptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
