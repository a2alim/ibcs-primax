import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcurementPlanWorksComponent } from './procurement-plan-works.component';

describe('ProcurementPlanWorksComponent', () => {
  let component: ProcurementPlanWorksComponent;
  let fixture: ComponentFixture<ProcurementPlanWorksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcurementPlanWorksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcurementPlanWorksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
