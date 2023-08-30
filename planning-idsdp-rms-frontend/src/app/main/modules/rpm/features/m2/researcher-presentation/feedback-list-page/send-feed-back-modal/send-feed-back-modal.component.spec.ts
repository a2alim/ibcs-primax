import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendFeedBackModalComponent } from './send-feed-back-modal.component';

describe('SendFeedBackModalComponent', () => {
  let component: SendFeedBackModalComponent;
  let fixture: ComponentFixture<SendFeedBackModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendFeedBackModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SendFeedBackModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
