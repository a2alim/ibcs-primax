import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateLetterGedComponent } from './create-letter-ged.component';

describe('CreateLetterGedComponent', () => {
  let component: CreateLetterGedComponent;
  let fixture: ComponentFixture<CreateLetterGedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateLetterGedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateLetterGedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
