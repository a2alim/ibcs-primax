import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewGoLetterModalComponent } from './view-go-letter-modal.component';

describe('ViewGoLetterModalComponent', () => {
  let component: ViewGoLetterModalComponent;
  let fixture: ComponentFixture<ViewGoLetterModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewGoLetterModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewGoLetterModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
