import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewLetterGedComponent } from './view-letter-ged.component';

describe('ViewLetterGedComponent', () => {
  let component: ViewLetterGedComponent;
  let fixture: ComponentFixture<ViewLetterGedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewLetterGedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewLetterGedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
