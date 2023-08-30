import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewGoLetterComponent } from './view-go-letter.component';

describe('ViewGoLetterComponent', () => {
  let component: ViewGoLetterComponent;
  let fixture: ComponentFixture<ViewGoLetterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewGoLetterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewGoLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
