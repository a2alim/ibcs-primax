import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GisMapDashboardComponent } from './gis-map-dashboard.component';

describe('GisMapDashboardComponent', () => {
  let component: GisMapDashboardComponent;
  let fixture: ComponentFixture<GisMapDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GisMapDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GisMapDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
