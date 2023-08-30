import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateGedFeedbakAnswerComponent } from './create-ged-feedbak-answer.component';

describe('CreateGedFeedbakAnswerComponent', () => {
  let component: CreateGedFeedbakAnswerComponent;
  let fixture: ComponentFixture<CreateGedFeedbakAnswerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateGedFeedbakAnswerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateGedFeedbakAnswerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
