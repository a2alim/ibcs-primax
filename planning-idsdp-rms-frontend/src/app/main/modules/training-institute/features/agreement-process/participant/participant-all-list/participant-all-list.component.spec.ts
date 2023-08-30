import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantAllListComponent } from './participant-all-list.component';

describe('ParticipantAllListComponent', () => {
  let component: ParticipantAllListComponent;
  let fixture: ComponentFixture<ParticipantAllListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParticipantAllListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticipantAllListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
