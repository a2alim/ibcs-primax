import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PmPdExpenditureComponent } from './pm-pd-expenditure.component';

describe('PmPdExpenditureComponent', () => {
  let component: PmPdExpenditureComponent;
  let fixture: ComponentFixture<PmPdExpenditureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PmPdExpenditureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PmPdExpenditureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
