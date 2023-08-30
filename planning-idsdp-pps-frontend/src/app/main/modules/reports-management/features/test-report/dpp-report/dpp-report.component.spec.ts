import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DppReportComponent } from './dpp-report.component';

describe('DppReportComponent', () => {
  let component: DppReportComponent;
  let fixture: ComponentFixture<DppReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DppReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DppReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
