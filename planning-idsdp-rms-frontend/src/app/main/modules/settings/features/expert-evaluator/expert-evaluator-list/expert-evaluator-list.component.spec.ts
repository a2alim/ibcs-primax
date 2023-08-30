import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpertEvaluatorListComponent } from './expert-evaluator-list.component';

describe('ExpertEvaluatorListComponent', () => {
  let component: ExpertEvaluatorListComponent;
  let fixture: ComponentFixture<ExpertEvaluatorListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpertEvaluatorListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpertEvaluatorListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
