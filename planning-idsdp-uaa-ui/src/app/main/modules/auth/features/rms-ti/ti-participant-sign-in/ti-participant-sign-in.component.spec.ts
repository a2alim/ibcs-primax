import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TiParticipantSignInComponent } from './ti-participant-sign-in.component';

describe('TiParticipantSignInComponent', () => {
  let component: TiParticipantSignInComponent;
  let fixture: ComponentFixture<TiParticipantSignInComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TiParticipantSignInComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TiParticipantSignInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
