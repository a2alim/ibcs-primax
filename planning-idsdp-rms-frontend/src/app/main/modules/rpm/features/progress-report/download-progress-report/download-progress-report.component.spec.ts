import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadProgressReportComponent } from './download-progress-report.component';

describe('DownloadProgressReportComponent', () => {
  let component: DownloadProgressReportComponent;
  let fixture: ComponentFixture<DownloadProgressReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DownloadProgressReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadProgressReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
