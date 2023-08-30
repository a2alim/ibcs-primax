import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionAnswerViewComponent } from './question-answer-view.component';

describe('QuestionAnswerViewComponent', () => {
  let component: QuestionAnswerViewComponent;
  let fixture: ComponentFixture<QuestionAnswerViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuestionAnswerViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionAnswerViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
