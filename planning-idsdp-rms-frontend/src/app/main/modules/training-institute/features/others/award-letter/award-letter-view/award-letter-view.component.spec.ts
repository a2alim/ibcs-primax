import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AwardLetterViewComponent } from './award-letter-view.component';

describe('AwardLetterViewComponent', () => {
  let component: AwardLetterViewComponent;
  let fixture: ComponentFixture<AwardLetterViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AwardLetterViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AwardLetterViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
