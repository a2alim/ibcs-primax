import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TppComponentWiseCostComponent } from './tpp-component-wise-cost.component';

describe('TppComponentWiseCostComponent', () => {
  let component: TppComponentWiseCostComponent;
  let fixture: ComponentFixture<TppComponentWiseCostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TppComponentWiseCostComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TppComponentWiseCostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
