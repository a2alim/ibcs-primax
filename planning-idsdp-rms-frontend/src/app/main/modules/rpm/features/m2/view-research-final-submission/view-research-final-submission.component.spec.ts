import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewResearchFinalSubmissionComponent } from './view-research-final-submission.component';

describe('ViewResearchFinalSubmissionComponent', () => {
  let component: ViewResearchFinalSubmissionComponent;
  let fixture: ComponentFixture<ViewResearchFinalSubmissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewResearchFinalSubmissionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewResearchFinalSubmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
