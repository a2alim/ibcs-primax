import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnswerPreparationCreateComponent } from './answer-preparation-create.component';

describe('AnswerPreparationCreateComponent', () => {
  let component: AnswerPreparationCreateComponent;
  let fixture: ComponentFixture<AnswerPreparationCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnswerPreparationCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnswerPreparationCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
