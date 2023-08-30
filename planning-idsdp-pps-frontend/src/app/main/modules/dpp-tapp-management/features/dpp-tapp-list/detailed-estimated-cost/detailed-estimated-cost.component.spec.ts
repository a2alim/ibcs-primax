import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedEstimatedCostComponent } from './detailed-estimated-cost.component';

describe('DetailedEstimatedCostComponent', () => {
  let component: DetailedEstimatedCostComponent;
  let fixture: ComponentFixture<DetailedEstimatedCostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailedEstimatedCostComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailedEstimatedCostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
