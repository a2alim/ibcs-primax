import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendFeedBackListPageComponent } from './send-feed-back-list-page.component';

describe('SendFeedBackListPageComponent', () => {
  let component: SendFeedBackListPageComponent;
  let fixture: ComponentFixture<SendFeedBackListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendFeedBackListPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SendFeedBackListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
