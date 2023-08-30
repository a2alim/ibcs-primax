import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcurementPlanGoodsComponent } from './procurement-plan-goods.component';

describe('ProcurementPlanGoodsComponent', () => {
  let component: ProcurementPlanGoodsComponent;
  let fixture: ComponentFixture<ProcurementPlanGoodsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcurementPlanGoodsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcurementPlanGoodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
