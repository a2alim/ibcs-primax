import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitPlanComponent } from './visit-plan.component';

describe('VisitPlanComponent', () => {
  let component: VisitPlanComponent;
  let fixture: ComponentFixture<VisitPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisitPlanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
