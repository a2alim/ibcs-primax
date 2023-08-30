import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeakerEvaluationReportNewComponent } from './speaker-evaluation-report-new.component';

describe('SpeakerEvaluationReportNewComponent', () => {
  let component: SpeakerEvaluationReportNewComponent;
  let fixture: ComponentFixture<SpeakerEvaluationReportNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpeakerEvaluationReportNewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpeakerEvaluationReportNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
