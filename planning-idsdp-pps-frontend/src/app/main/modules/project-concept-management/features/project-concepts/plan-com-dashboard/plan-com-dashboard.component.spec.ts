import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanComDashboardComponent } from './plan-com-dashboard.component';

describe('PlanComDashboardComponent', () => {
  let component: PlanComDashboardComponent;
  let fixture: ComponentFixture<PlanComDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlanComDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanComDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
