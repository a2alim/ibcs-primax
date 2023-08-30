import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcurementPlanServicesComponent } from './procurement-plan-services.component';

describe('ProcurementPlanServicesComponent', () => {
  let component: ProcurementPlanServicesComponent;
  let fixture: ComponentFixture<ProcurementPlanServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcurementPlanServicesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcurementPlanServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
