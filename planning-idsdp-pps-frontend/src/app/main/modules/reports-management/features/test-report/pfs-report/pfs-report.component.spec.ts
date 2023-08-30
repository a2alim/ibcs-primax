import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PfsReportComponent } from './pfs-report.component';

describe('PfsReportComponent', () => {
  let component: PfsReportComponent;
  let fixture: ComponentFixture<PfsReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PfsReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PfsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
