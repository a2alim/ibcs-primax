import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewCourseScheduleComponent } from './add-new-course-schedule.component';

describe('AddNewCourseScheduleComponent', () => {
  let component: AddNewCourseScheduleComponent;
  let fixture: ComponentFixture<AddNewCourseScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddNewCourseScheduleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewCourseScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
