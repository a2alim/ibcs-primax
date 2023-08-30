import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PmWorkPlanComponent } from './pm-work-plan.component';

describe('PmWorkPlanComponent', () => {
  let component: PmWorkPlanComponent;
  let fixture: ComponentFixture<PmWorkPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PmWorkPlanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PmWorkPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
