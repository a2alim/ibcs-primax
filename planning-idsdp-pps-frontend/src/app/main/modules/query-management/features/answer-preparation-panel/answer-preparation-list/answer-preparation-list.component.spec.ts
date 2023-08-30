import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnswerPreparationListComponent } from './answer-preparation-list.component';

describe('AnswerPreparationListComponent', () => {
  let component: AnswerPreparationListComponent;
  let fixture: ComponentFixture<AnswerPreparationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnswerPreparationListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnswerPreparationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
