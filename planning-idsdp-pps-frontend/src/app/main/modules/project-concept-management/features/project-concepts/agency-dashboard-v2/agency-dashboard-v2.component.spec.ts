import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgencyDashboardV2Component } from './agency-dashboard-v2.component';

describe('AgencyDashboardV2Component', () => {
  let component: AgencyDashboardV2Component;
  let fixture: ComponentFixture<AgencyDashboardV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgencyDashboardV2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgencyDashboardV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
