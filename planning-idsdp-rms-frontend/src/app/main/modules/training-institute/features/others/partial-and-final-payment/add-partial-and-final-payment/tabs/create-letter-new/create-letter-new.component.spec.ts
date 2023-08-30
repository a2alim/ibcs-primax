import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateLetterNewComponent } from './create-letter-new.component';

describe('CreateLetterNewComponent', () => {
  let component: CreateLetterNewComponent;
  let fixture: ComponentFixture<CreateLetterNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateLetterNewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateLetterNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
