import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenditureCostComponent } from './expenditure-cost.component';

describe('ExpenditureCostComponent', () => {
  let component: ExpenditureCostComponent;
  let fixture: ComponentFixture<ExpenditureCostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpenditureCostComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenditureCostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
