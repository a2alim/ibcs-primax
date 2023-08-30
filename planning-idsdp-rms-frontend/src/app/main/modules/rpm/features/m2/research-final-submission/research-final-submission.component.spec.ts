import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResearchFinalSubmissionComponent } from './research-final-submission.component';

describe('ResearchFinalSubmissionComponent', () => {
  let component: ResearchFinalSubmissionComponent;
  let fixture: ComponentFixture<ResearchFinalSubmissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResearchFinalSubmissionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResearchFinalSubmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
