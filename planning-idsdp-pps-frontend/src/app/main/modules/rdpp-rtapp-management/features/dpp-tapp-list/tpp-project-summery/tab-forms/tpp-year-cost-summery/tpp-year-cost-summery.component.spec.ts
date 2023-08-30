import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TppYearCostSummeryComponent } from './tpp-year-cost-summery.component';

describe('TppYearCostSummeryComponent', () => {
  let component: TppYearCostSummeryComponent;
  let fixture: ComponentFixture<TppYearCostSummeryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TppYearCostSummeryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TppYearCostSummeryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
