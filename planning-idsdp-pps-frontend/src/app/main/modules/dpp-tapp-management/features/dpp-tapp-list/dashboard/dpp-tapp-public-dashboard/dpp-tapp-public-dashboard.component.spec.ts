import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DppTappPublicDashboardComponent } from './dpp-tapp-public-dashboard.component';

describe('DppTappPublicDashboardComponent', () => {
  let component: DppTappPublicDashboardComponent;
  let fixture: ComponentFixture<DppTappPublicDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DppTappPublicDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DppTappPublicDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
