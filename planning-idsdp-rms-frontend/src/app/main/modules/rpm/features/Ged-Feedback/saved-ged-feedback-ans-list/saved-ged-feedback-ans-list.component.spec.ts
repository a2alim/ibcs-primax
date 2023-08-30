import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavedGedFeedbackAnsListComponent } from './saved-ged-feedback-ans-list.component';

describe('SavedGedFeedbackAnsListComponent', () => {
  let component: SavedGedFeedbackAnsListComponent;
  let fixture: ComponentFixture<SavedGedFeedbackAnsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SavedGedFeedbackAnsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SavedGedFeedbackAnsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
