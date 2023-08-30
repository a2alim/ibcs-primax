import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateGoLetterComponent } from './create-go-letter.component';

describe('CreateGoLetterComponent', () => {
  let component: CreateGoLetterComponent;
  let fixture: ComponentFixture<CreateGoLetterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateGoLetterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateGoLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
