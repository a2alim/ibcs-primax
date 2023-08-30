import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryWiseGrantAmountComponent } from './category-wise-grant-amount.component';

describe('CategoryWiseGrantAmountComponent', () => {
  let component: CategoryWiseGrantAmountComponent;
  let fixture: ComponentFixture<CategoryWiseGrantAmountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategoryWiseGrantAmountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryWiseGrantAmountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
