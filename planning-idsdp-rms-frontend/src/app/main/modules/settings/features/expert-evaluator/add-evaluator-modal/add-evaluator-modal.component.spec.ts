import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEvaluatorModalComponent } from './add-evaluator-modal.component';

describe('AddEvaluatorModalComponent', () => {
  let component: AddEvaluatorModalComponent;
  let fixture: ComponentFixture<AddEvaluatorModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEvaluatorModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEvaluatorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
