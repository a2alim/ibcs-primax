import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatWiseActionPlanComponent } from './cat-wise-action-plan.component';

describe('CatWiseActionPlanComponent', () => {
  let component: CatWiseActionPlanComponent;
  let fixture: ComponentFixture<CatWiseActionPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CatWiseActionPlanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CatWiseActionPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
