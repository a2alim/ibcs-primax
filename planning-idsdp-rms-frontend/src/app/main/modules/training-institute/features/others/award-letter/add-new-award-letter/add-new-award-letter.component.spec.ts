import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewAwardLetterComponent } from './add-new-award-letter.component';

describe('AddNewAwardLetterComponent', () => {
  let component: AddNewAwardLetterComponent;
  let fixture: ComponentFixture<AddNewAwardLetterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddNewAwardLetterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewAwardLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
