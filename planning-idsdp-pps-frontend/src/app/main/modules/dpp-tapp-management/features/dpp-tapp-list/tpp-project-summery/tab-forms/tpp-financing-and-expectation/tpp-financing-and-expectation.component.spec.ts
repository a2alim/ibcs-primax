import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TppFinancingAndExpectationComponent } from './tpp-financing-and-expectation.component';

describe('TppFinancingAndExpectationComponent', () => {
  let component: TppFinancingAndExpectationComponent;
  let fixture: ComponentFixture<TppFinancingAndExpectationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TppFinancingAndExpectationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TppFinancingAndExpectationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
