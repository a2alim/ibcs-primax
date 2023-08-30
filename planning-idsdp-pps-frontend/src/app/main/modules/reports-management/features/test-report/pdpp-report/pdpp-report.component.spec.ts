import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdppReportComponent } from './pdpp-report.component';

describe('PdppReportComponent', () => {
  let component: PdppReportComponent;
  let fixture: ComponentFixture<PdppReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PdppReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PdppReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
