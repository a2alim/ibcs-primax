import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPmWorkPlanComponent } from './view-pm-work-plan.component';

describe('ViewPmWorkPlanComponent', () => {
  let component: ViewPmWorkPlanComponent;
  let fixture: ComponentFixture<ViewPmWorkPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewPmWorkPlanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPmWorkPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
