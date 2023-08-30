import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PmProcurementPlanComponent } from './pm-procurement-plan.component';

describe('PmProcurementPlanComponent', () => {
  let component: PmProcurementPlanComponent;
  let fixture: ComponentFixture<PmProcurementPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PmProcurementPlanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PmProcurementPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
