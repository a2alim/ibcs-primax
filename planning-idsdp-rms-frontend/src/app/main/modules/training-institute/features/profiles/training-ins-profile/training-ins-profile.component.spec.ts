import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingInsProfileComponent } from './training-ins-profile.component';

describe('TrainingInsProfileComponent', () => {
  let component: TrainingInsProfileComponent;
  let fixture: ComponentFixture<TrainingInsProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrainingInsProfileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingInsProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
