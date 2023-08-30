import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackAnswerComponent } from './feedback-answer.component';

describe('FeedbackAnswerComponent', () => {
  let component: FeedbackAnswerComponent;
  let fixture: ComponentFixture<FeedbackAnswerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeedbackAnswerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedbackAnswerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
