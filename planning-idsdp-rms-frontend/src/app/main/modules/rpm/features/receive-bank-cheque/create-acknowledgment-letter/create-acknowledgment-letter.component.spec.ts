import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAcknowledgmentLetterComponent } from './create-acknowledgment-letter.component';

describe('CreateAcknowledgmentLetterComponent', () => {
  let component: CreateAcknowledgmentLetterComponent;
  let fixture: ComponentFixture<CreateAcknowledgmentLetterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateAcknowledgmentLetterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAcknowledgmentLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
