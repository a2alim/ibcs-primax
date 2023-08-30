import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AwardLetterComponent } from './award-letter.component';

describe('AwardLetterComponent', () => {
  let component: AwardLetterComponent;
  let fixture: ComponentFixture<AwardLetterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AwardLetterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AwardLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
