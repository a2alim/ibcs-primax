import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeminarParticipantTabComponent } from './seminar-participant-tab.component';

describe('SeminarParticipantTabComponent', () => {
  let component: SeminarParticipantTabComponent;
  let fixture: ComponentFixture<SeminarParticipantTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeminarParticipantTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeminarParticipantTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
