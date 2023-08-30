import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModeOfFinanceComponent } from './mode-of-finance.component';

describe('ModeOfFinanceComponent', () => {
  let component: ModeOfFinanceComponent;
  let fixture: ComponentFixture<ModeOfFinanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModeOfFinanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModeOfFinanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
