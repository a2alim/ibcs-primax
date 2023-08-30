import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackListPageComponent } from './feedback-list-page.component';

describe('FeedbackListPageComponent', () => {
  let component: FeedbackListPageComponent;
  let fixture: ComponentFixture<FeedbackListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeedbackListPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedbackListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
