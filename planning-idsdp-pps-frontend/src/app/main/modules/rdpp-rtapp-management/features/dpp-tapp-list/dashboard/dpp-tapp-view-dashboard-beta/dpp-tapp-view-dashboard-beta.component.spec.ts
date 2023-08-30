import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DppTappViewDashboardBetaComponent } from './dpp-tapp-view-dashboard-beta.component';

describe('DppTappViewDashboardBetaComponent', () => {
  let component: DppTappViewDashboardBetaComponent;
  let fixture: ComponentFixture<DppTappViewDashboardBetaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DppTappViewDashboardBetaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DppTappViewDashboardBetaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
