import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackEditModalComponent } from './feedback-edit-modal.component';

describe('FeedbackEditModalComponent', () => {
  let component: FeedbackEditModalComponent;
  let fixture: ComponentFixture<FeedbackEditModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeedbackEditModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedbackEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
