import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationWiseBdReportComponent } from './location-wise-bd-report.component';

describe('LocationWiseBdReportComponent', () => {
  let component: LocationWiseBdReportComponent;
  let fixture: ComponentFixture<LocationWiseBdReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LocationWiseBdReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationWiseBdReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
