import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateGoLetterModalComponent } from './create-go-letter-modal.component';

describe('CreateGoLetterModalComponent', () => {
  let component: CreateGoLetterModalComponent;
  let fixture: ComponentFixture<CreateGoLetterModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateGoLetterModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateGoLetterModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
