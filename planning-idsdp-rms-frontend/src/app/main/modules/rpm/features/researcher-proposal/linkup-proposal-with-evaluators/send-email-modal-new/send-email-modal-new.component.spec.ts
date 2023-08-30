import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendEmailModalNewComponent } from './send-email-modal-new.component';

describe('SendEmailModalNewComponent', () => {
  let component: SendEmailModalNewComponent;
  let fixture: ComponentFixture<SendEmailModalNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendEmailModalNewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SendEmailModalNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
