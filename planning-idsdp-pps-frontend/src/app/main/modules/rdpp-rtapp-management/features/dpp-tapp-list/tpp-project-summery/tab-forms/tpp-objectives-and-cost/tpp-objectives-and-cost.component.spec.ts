import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TppObjectivesAndCostComponent } from './tpp-objectives-and-cost.component';

describe('TppObjectivesAndCostComponent', () => {
  let component: TppObjectivesAndCostComponent;
  let fixture: ComponentFixture<TppObjectivesAndCostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TppObjectivesAndCostComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TppObjectivesAndCostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
