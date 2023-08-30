import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ComponentWiseCostComponent} from './component-wise-cost.component';

describe('ComponentWiseCostComponent', () => {
  let component: ComponentWiseCostComponent;
  let fixture: ComponentFixture<ComponentWiseCostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComponentWiseCostComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComponentWiseCostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
