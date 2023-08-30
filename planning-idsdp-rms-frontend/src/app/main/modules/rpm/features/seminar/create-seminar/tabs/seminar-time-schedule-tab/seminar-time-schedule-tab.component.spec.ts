import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeminarTimeScheduleTabComponent } from './seminar-time-schedule-tab.component';

describe('SeminarTimeScheduleTabComponent', () => {
  let component: SeminarTimeScheduleTabComponent;
  let fixture: ComponentFixture<SeminarTimeScheduleTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeminarTimeScheduleTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeminarTimeScheduleTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
