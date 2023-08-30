import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluatorProfileComponent } from './evaluator-profile.component';

describe('EvaluatorProfileComponent', () => {
  let component: EvaluatorProfileComponent;
  let fixture: ComponentFixture<EvaluatorProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EvaluatorProfileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluatorProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
