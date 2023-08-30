import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ObjectAndCostComponent} from './object-and-cost.component';

describe('ObjectAndCostComponent', () => {
  let component: ObjectAndCostComponent;
  let fixture: ComponentFixture<ObjectAndCostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ObjectAndCostComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjectAndCostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
