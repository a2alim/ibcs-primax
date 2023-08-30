import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoLetterComponent } from './go-letter.component';

describe('GoLetterComponent', () => {
  let component: GoLetterComponent;
  let fixture: ComponentFixture<GoLetterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GoLetterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GoLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
